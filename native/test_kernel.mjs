
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const bytes = readFileSync(join(here, "trend_layout.wasm"));
const { instance } = await WebAssembly.instantiate(bytes, {});
const ex = instance.exports;
console.log("wasm exports:", Object.keys(ex).join(", "));

const mem = ex.memory;
let HEAP = ex.__heap_base.value;
const CATS = 7;
const V_PTR  = HEAP;                      // float32[n*7]
const R_PTR  = V_PTR + 1500 * CATS * 4;   // float32[cap*7*4]
const C_PTR  = R_PTR + 1500 * CATS * 4 * 4;
const N_PTR  = C_PTR + 1500 * CATS;

// ---- JS 参考实现：逐像素复刻原 ChartBar 的数学 ----
function refLayout({ from, to, values, barW, gap, mode, maxTotal, deltaScale, upPx, chartH, padTop }) {
  const pitch = barW + gap;
  const baseBottom = padTop + chartH;
  const zeroY = padTop + upPx;
  const rects = [], cats = [], counts = [];
  for (let i = from; i < to; i++) {
    const x = i * pitch;
    let cnt = 0;
    if (mode === 0) {
      let y = baseBottom;
      for (let c = 0; c < CATS; c++) {
        const v = values[i * CATS + c];
        if (v === 0) continue;
        let h = Math.max(1, Math.round(v / maxTotal * chartH));
        y -= h; rects.push([x, y, barW, h]); cats.push(c); cnt++;
      }
    } else {
      let y = zeroY;
      for (let c = 0; c < CATS; c++) {
        const d = values[i * CATS + c];
        if (d <= 0) continue;
        let h = Math.max(1, Math.round(d * deltaScale));
        y -= h; rects.push([x, y, barW, h]); cats.push(c); cnt++;
      }
      let yd = zeroY;
      for (let c = 0; c < CATS; c++) {
        const d = values[i * CATS + c];
        if (d >= 0) continue;
        let h = Math.max(1, Math.round(d * deltaScale));
        rects.push([x, yd, barW, h]); cats.push(c); yd += h; cnt++;
      }
    }
    counts.push(cnt);
  }
  return { rects, cats, counts };
}

function rnd(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

let cases = 0, maxDev = 0, mismatches = 0;
const r = rnd(20240607);
for (let t = 0; t < 400; t++) {
  const n = 1 + Math.floor(r() * 60);
  const barW = 14, gap = 2, chartH = 112, padTop = 18;
  const mode = r() < 0.5 ? 0 : 1;
  const from = Math.floor(r() * n);
  const to = from + 1 + Math.floor(r() * (n - from));
  const values = new Float32Array(n * CATS);
  const dense = r() < 0.5;
  for (let k = 0; k < n * CATS; k++) {
    const z = r();
    if (dense) values[k] = Math.round((r() - 0.35) * 900);
    else values[k] = z < 0.45 ? 0 : Math.round((r() - 0.4) * 900);
  }
  const maxTotal = 1 + Math.floor(r() * 4000);
  const deltaScale = 0.01 + r() * 0.6;
  const upPx = Math.floor(r() * (chartH + 1));

  new Float32Array(mem.buffer, V_PTR, n * CATS).set(values);
  const seg = ex.tl_layout(from, to, n, V_PTR, barW, gap, mode, maxTotal, deltaScale, upPx, chartH, padTop, from * (barW + gap), R_PTR, C_PTR, N_PTR);
  const rectsOut = new Float32Array(mem.buffer, R_PTR, seg * 4);
  const catsOut = new Uint8Array(mem.buffer, C_PTR, seg);
  const countsOut = new Uint8Array(mem.buffer, N_PTR, to - from);

  const ref = refLayout({ from, to, values, barW, gap, mode, maxTotal, deltaScale, upPx, chartH, padTop });
  cases++;
  if (seg !== ref.rects.length) { mismatches++; if (mismatches < 4) console.log("段数不符", seg, ref.rects.length, { from, to, mode }); continue; }
  for (let k = 0; k < seg; k++) {
    if (catsOut[k] !== ref.cats[k]) { mismatches++; break; }
    for (let c = 0; c < 4; c++) {
      const d = Math.abs(rectsOut[k * 4 + c] - ref.rects[k][c]);
      if (d > maxDev) maxDev = d;
      if (d > 1.0) { mismatches++; break; }
    }
  }
  for (let k = 0; k < to - from; k++) if (countsOut[k] !== ref.counts[k]) { mismatches++; break; }
}

// ---- 命中测试与窗口 ----
let hitBad = 0;
for (let t = 0; t < 2000; t++) {
  const n = 1 + Math.floor(r() * 1500);
  const x = (r() * (n + 4) - 2) * 16;
  const got = ex.tl_hit(x, 14, 2, n);
  const want = x < 0 ? -1 : (() => { const i = Math.floor(x / 16); return i < 0 || i >= n ? -1 : i; })();
  if (got !== want) hitBad++;
}
let winBad = 0;
for (let t = 0; t < 2000; t++) {
  const n = 1 + Math.floor(r() * 1500);
  const sl = r() * n * 16;
  const got = ex.tl_window_start(sl, 14, 2, n);
  const want = sl <= 0 ? 0 : Math.min(n, Math.max(0, Math.floor(sl / 16)));
  if (got !== want) winBad++;
}

console.log("");
console.log("布局用例 " + cases + " 个，不一致 " + mismatches + " 个，最大像素偏差 " + maxDev.toFixed(4));
console.log("命中测试 2000 例，不一致 " + hitBad + " 个");
console.log("窗口计算 2000 例，不一致 " + winBad + " 个");
console.log((mismatches === 0 && hitBad === 0 && winBad === 0) ? "=> 全部通过：WASM 与 JS 参考实现等价" : "=> 存在不一致，需修正");
