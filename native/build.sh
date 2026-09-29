#!/usr/bin/env bash
# 把 trend_layout.cpp 编译成 freestanding wasm32 模块。
# 依赖 clang++（wasm32 后端）+ wasm-ld：
#   MSYS2: pacman -S mingw-w64-clang-x86_64-clang mingw-w64-clang-x86_64-lld
set -euo pipefail
cd "$(dirname "$0")"
CC="$CLANGXX"
if [ -z "$CC" ]; then CC=/a/msys64/clang64/bin/clang++.exe; fi
"$CC" --target=wasm32 -O3 -ffreestanding -nostdlib -fno-exceptions -fno-rtti \
  -Wl,--no-entry -Wl,--export-memory -Wl,--initial-memory=4194304 \
  -Wl,--export=tl_layout -Wl,--export=tl_hit -Wl,--export=tl_window_start -Wl,--export=tl_cost -Wl,--export=tl_isPeakAt \
  -Wl,--export=__heap_base -Wl,--allow-undefined \
  -o trend_layout.wasm trend_layout.cpp
echo "built: $(wc -c < trend_layout.wasm) bytes"
