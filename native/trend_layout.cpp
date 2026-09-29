// trend_layout.cpp — dsh-context Context Trend 布局内核
//
// 目标：把"每帧 × 每柱 × 每类别"的几何计算从 JS 移到原生，并输出紧凑的
// rect 缓冲供 <canvas> 直接消费 —— 零对象分配、零跨边界拷贝。
//
// 编译（freestanding wasm32，无 libc）：见同目录 build.sh
//
// 与 JS 参考实现（client.js 的 fallbackLayout）必须逐像素一致；
// 正确性由 native/test_kernel.mjs 断言。

typedef unsigned char u8;

// 类别数，与 client.js 的 CATS 长度一致
enum { TL_CATS = 7 };

// Math.round 的等价物（half away from zero；本内核所有取整结果都会被 clamp
// 到 >= 1，因此负半值的差异不可达）
static inline float tl_round(float x) { return (float)(int)(x + (x >= 0.0f ? 0.5f : -0.5f)); }

extern "C" {

// 布局一个可见窗口。
//   from,to    可见窗口 [from,to)（JS 依 scrollLeft/clientWidth 算出）
//   n          柱总数
//   values     n*7 的类别分量：total 模式为堆叠量，delta 模式为有符号增量
//   barW,gap   柱宽与柱间距
//   mode       0 = total（自基线向上堆叠） 1 = delta（自零线上下分叉）
//   maxTotal   total 模式的归一化分母
//   deltaScale delta 模式的像素/单位
//   upPx       delta 模式零线距图顶的距离
//   chartH     绘图高度（112）
//   padTop     图顶内边距（18）
//   originX    窗口起点在内容坐标中的 x（= from*(barW+gap)）
//   outRects   输出 rect(x,y,w,h)，容量 (to-from)*7*4
//   outCats    输出类别索引，容量 (to-from)*7
//   outCounts  输出每柱段数，容量 (to-from)
// 返回写入的段总数。
int tl_layout(int from, int to, int n,
              const float* values,
              float barW, float gap,
              int mode,
              float maxTotal, float deltaScale, float upPx,
              float chartH, float padTop, float originX,
              float* outRects, u8* outCats, u8* outCounts) {
  if (from < 0) from = 0;
  if (to > n) to = n;
  if (to < from) to = from;

  const float pitch = barW + gap;
  const float baseBottom = padTop + chartH;   // total 模式的基线
  const float zeroY = padTop + upPx;          // delta 模式的零线
  int seg = 0;

  for (int i = from; i < to; i++) {
    const float x = originX + (float)(i - from) * pitch;
    int cnt = 0;

    if (mode == 0) {
      // 自基线向上堆叠；CATS 顺序即堆叠顺序（索引 0 在最下）
      float y = baseBottom;
      for (int c = 0; c < TL_CATS; c++) {
        const float v = values[i * TL_CATS + c];
        if (v == 0.0f) continue;
        float h = tl_round(v / maxTotal * chartH);
        if (h < 1.0f) h = 1.0f;
        y -= h;
        float* r = outRects + seg * 4;
        r[0] = x; r[1] = y; r[2] = barW; r[3] = h;
        outCats[seg] = (u8)c;
        seg++; cnt++;
      }
    } else {
      // 正分量：自零线向上堆叠（索引小的更靠近零线）
      float y = zeroY;
      for (int c = 0; c < TL_CATS; c++) {
        const float d = values[i * TL_CATS + c];
        if (d <= 0.0f) continue;
        float h = tl_round(d * deltaScale);
        if (h < 1.0f) h = 1.0f;
        y -= h;
        float* r = outRects + seg * 4;
        r[0] = x; r[1] = y; r[2] = barW; r[3] = h;
        outCats[seg] = (u8)c;
        seg++; cnt++;
      }
      // 负分量：自零线向下堆叠
      float yd = zeroY;
      for (int c = 0; c < TL_CATS; c++) {
        const float d = values[i * TL_CATS + c];
        if (d >= 0.0f) continue;
        float h = tl_round(d * deltaScale);
        if (h < 1.0f) h = 1.0f;
        float* r = outRects + seg * 4;
        r[0] = x; r[1] = yd; r[2] = barW; r[3] = h;
        outCats[seg] = (u8)c;
        yd += h;
        seg++; cnt++;
      }
    }
    outCounts[i - from] = (u8)cnt;
  }
  return seg;
}

// O(1) 命中测试：内容坐标 x -> 柱索引，越界返回 -1
int tl_hit(float x, float barW, float gap, int n) {
  if (x < 0.0f) return -1;
  const int i = (int)(x / (barW + gap));
  return (i < 0 || i >= n) ? -1 : i;
}

// 可见窗口起点：内容坐标 scrollLeft -> 起始柱索引
int tl_window_start(float scrollLeft, float barW, float gap, int n) {
  const float pitch = barW + gap;
  if (scrollLeft <= 0.0f) return 0;
  int i = (int)(scrollLeft / pitch);
  if (i < 0) i = 0;
  if (i > n) i = n;
  return i;
}

} // extern "C"
