![Social preview](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/social-preview.png)

# dsh-context

**中文** | [English](README.en.md)

> **本仓库说明**：这是 `dsh-context` **v0.53.1 构建产物的本地修补版** —— 不同步上游源码，仓库里只有当前可用的构建代码（`lib/`）与本次修补说明。原作者、版权与许可：**bowenliang123**（Apache-2.0），详见文末「本地改动」「致谢」「License」。

[![npm version](https://img.shields.io/npm/v/dsh-context)](https://www.npmjs.com/package/dsh-context)
[![GitHub stars](https://img.shields.io/github/stars/bowenliang123/dsh-context?style=social)](https://github.com/bowenliang123/dsh-context)
[![dshfind](https://dshfind.com/api/badge/bowenliang123/dsh-context)](https://dshfind.com/en/plugins/bowenliang123/dsh-context?ref=badge)

**最好的 [DeepSeek Harness 插件](https://www.deepseek.com/harness/)，用于 Agent 的上下文洞察与管理。**

[`dsh-context`](https://www.npmjs.com/package/dsh-context) 提供完整的上下文生命周期管理能力：

- **Context Dashboard（上下文仪表盘）** —— 侧边栏底部的跨会话总览（本修补版把它放在费用插件的余额行之上、独占一行）：KPI 带、活跃热力图、整体组成环，以及可筛选的会话卡片，一键跳进任意会话。
- **Context 标签页** —— 会话内的上下文仪表盘：统计、组成、按请求的趋势、事件与消息。
- **Context 面板** —— 同一份仪表盘作为右侧栏标签（dsh 0.1.5-rc.1+）：在侧边栏引导页选择 **Context**，面板就在对话旁打开。
- **`/context` 命令** —— 斜杠命令直接给出当前上下文组成与近期上下文演进。

## 安装 / 更新

从 [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh) 安装 [`dsh-context`](https://www.npmjs.com/package/dsh-context)：

```sh
dsh plugin --profile web add dsh-context
```

更新 `dsh-context`：

```sh
dsh plugin --profile web update dsh-context@latest
```

安装**本修补版**（纯构建产物仓库，无需构建步骤）：

```sh
dsh plugin --profile web add git+https://github.com/ycm50/dsh-context.git
```

装好后用 `dsh web` 启动 Web 界面，无需构建、无需重启。

## 用它

四个入口，一个故事 —— 你的 Agent 身上背着什么、怎么变成这样、又用它做了什么：

| 位置 | 你能看到什么 |
| --- | --- |
| **Context Dashboard** | 一眼看全部会话：用量、费用、缓存命中、每日活跃度与每个会话的上下文画像 —— 可按范围/日期/分组/搜索筛选，一键跳入。 |
| **Context 标签页** | 完整仪表盘：统计、组成、按请求趋势、事件、文件活动与 Agent 网络 —— 每个会话里都有。 |
| **`/context` 命令** | 居中弹窗里的同一套组成视图与上下文浏览器，不用离开对话。 |
| **设置 → 插件配置** | 每用户默认值：趋势粒度与模式、File Activity 排序。 |

## 🗂️ Context Dashboard（上下文仪表盘）

在侧边栏底部点击 **Context Dashboard / 上下文仪表盘**（本修补版中它独占一行，位于费用插件的余额行之上）：

![Context Dashboard](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-dashboard.png)

| 区块 | 回答的问题 |
| --- | --- |
| **KPI 带** | 我用了多少 —— 所选范围（7 天 / 30 天 / 全部）内的会话数、计费 token、估算费用与缓存命中率。 |
| **活跃热力图** | 我什么时候真的在工作 —— 最近 8 周每日计费 token；点某一天即可筛选当天活跃的会话。 |
| **上下文组成** | 上下文窗口都花在哪了 —— 按范围内会话汇总。 |
| **会话卡片** | 每个会话的画像：组成环、计费 token、轮数、费用，以及所属工作区分组/项目面包屑 —— 可按最近、token、上下文大小排序，可搜索，按工作区分组。点卡片即打开该会话。 |

## 📊 Context 标签页

打开任意会话，点 **Context / 上下文** 标签：

![Context panel overview](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-overview.png)

| 卡片 | 回答的问题 |
| --- | --- |
| **Context Stats** | 轮数、步数、人工输入、进行中的工具调用、该会话缓存命中率 —— 外加按 models.dev 标价估算的费用（悬停 `?` 看每 1M 单价；识别 DeepSeek 峰谷价）。 |
| **Token Stats** | 计费 token 都花在哪 —— 与输入框下方统计行同一个总数，按组成拆分（system、tools、messages……），并用提供方精确的输出量闭合圆环。 |
| **Timing Stats** | 活跃时间如何在模型调用、工具运行与开销之间分配。 |
| **Current Context** | *此刻*窗口里有什么。 |
| **Context Trend** | 每一次请求的体积 —— 以及它背后的故事。 |
| **Context Browser** | 任意一次请求*究竟*由什么拼装而成。 |
| **Context Events** | 窗口何时、因何改变。 |
| **File Activity** | Agent 对你的文件*做了什么*。 |
| **Agent Network** | 整个 Agent 家族，实时呈现。 |

头部占用率与组成读取的是**与对话输入框上下文环完全相同的官方 token-meter 投影**（`contextPressure` / `contextBreakdown`），因此数字始终和环上显示的一致。

### Context Stats

#### Token Stats 与 Timing Stats
![Token_Stats_and_Timing_Stats](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/token-stats-and-timing-stats.png)

#### Context Stats
![Context_Stats](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-stats.png)

### 🧱 Current Context —— 此刻上下文窗口里有什么

![Current Context card](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/current-context.png)

对着模型完整窗口的一条六色堆叠条（斜纹 = 空闲余量）：系统提示、工具 schema、用户消息、注入上下文、助手回复、工具结果 —— 每段都带 ≈token 数与占比。当对话开始劣化，这里能看出*是哪一部分*造成的。

### 📈 Context Trend —— 上下文按轮或按步如何增长与演进

![Context Trend with the step brief](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-trend.png)

每次模型请求一条堆叠条（比按消息更细），于是你能一轮一轮看窗口怎么长：

- **✨ 步骤摘要（Step brief）** —— 图下三行白话：**User** 回顾开启本轮的那条消息，**In** 列出新进来的内容（通常是上一批工具结果），**Response** 显示回复与/或调用的工具。点任意一行即在 Context 浏览器中打开那条确切的消息。
- **✂ 标记事件** —— 压缩（compaction）与剪枝（prune）钉在它们发生的柱子上，掉落因此自解释。
- **按你的方式读** —— **Step / Turn** 粒度、**Total**（累计构成）或 **Delta**（每次请求的有符号变化），并可横向滚动整个会话。Delta 模式下，增长堆在基线上方，一次压缩则向下探：

![Context Trend in Delta mode](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/history-delta.png)

- **悬停与钉住** —— 划过即得即时提示；点击钉住完整拆分，估算值旁给出提供方上报的 **Actual Prompt / Output / Cache**。
- **实时联动** —— 悬停某条柱子会在旁边 Context 浏览器里预览该步装配出的上下文；离开图表则回到你自己选中的那一步。

### 🧭 Context Browser —— 打开任意请求的黑盒

选择 **Live (next request)** 或任一保留的请求步，浏览它由什么装配而成：七个可折叠类别展开成每个元素一行并标注 token 代价，每个元素还能再展开成**实际内容** —— 系统提示、各工具的 JSON schema、消息文本、推理、工具参数与工具输出。技能内容（可用技能目录、`/skill` 调用与 `skill` 工具加载）单列 **Skill Injections** 类别，因此“隐形”技能的上下文占用无法藏在注入上下文与工具结果桶里。

- **每个工具的提供方** —— 每条工具 schema 行都带一个尽力而为的来源标签：`tool-*` 一方包、`dsh-*` 能力包、`mcp:<server>` 代理，或从 `tools.register()` 实时观察到的确切插件。可按 **大小 / 名称** 排序，并按各分类自己的可搜索字段过滤：

![Tool schemas with source chips, filter, and sort](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-tools.png)

- **工具结果展开成完整调用** —— 工具名与参数、**OK/error** 状态、带行数的结果体，以及 **Raw / Markdown** 切换：

![A tool result expanded with Raw/Markdown toggle](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-tool-result.png)

- **图片载荷渲染成卡片** —— 缩略图带名称、尺寸、存储大小与官方 DeepSeek 图片 token 估算（dsh 多模态管线，例如 `read_image` 结果与图片附件）：

![An image payload rendered as a thumbnail card](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-images.png)

- **与上一轮对比** —— 每类的带符号差量徽标（`+N` 项、`±Nk` token）一眼看出这一轮增加了或回收了什么。早于某次压缩的步骤会从被移除消息的归档中重建 —— 当某步的构成只是近似时，卡片会说明。

### ⚡ Context Events —— 窗口何时、因何改变

![Context Events with a compaction](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-events.png)

每一次注入、压缩、剪枝、模型切换与 plan 模式切换 —— 都标注了产生者（指令文件、插件 id、技能名）、净 token 变化（压缩会显示回收了多少）、轮/步与时间。**Inject / Compact / Prune / Switch / Mode** 芯片按类型过滤日志，每个都带全会话事件计数。

### 📁 File Activity —— Agent 对你的文件做了什么

![File Activity](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/file-activity.png)

每个被触及的文件一行 —— 读、写或搜索 —— 聚合到你趋势图上选中的那一步：

- **按用途计数**，表头芯片兼作筛选（**Read / Written / Searched / Images**），外加路径搜索框。
- **行差量** —— 每次 `edit`/`write` 贡献估算的 `+added / −removed` 足迹，按文件与汇总。
- **所有模式都计入** —— 原生工具、Minimal 预设的 `str_replace_editor`，以及 PTC `run_code` 程序里的嵌套调用，都折算进按工具的行。
- **搜索落到真实文件** —— 命中的文件有自己的操作行与命中次数。
- **点一行**展开完整操作日志 —— 每个操作都能直接跳到 Context 浏览器里那个确切的工具结果。
- **点文件名**在右侧栏打开预览（dsh 0.1.5-rc.1+），与内置 Files 侧栏完全一致 —— 同一个查看器、同样的按文件分标签行为。没有该栏的 harness 上，文件名仍像以前一样用系统程序打开。

### 🕸 Agent Network —— 全家福

![Agent Network with two subagents](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/agent-network.png)

当前 Agent、它的父级与所有子 Agent —— 每个 Agent 一个节点，血缘用彩色连线，多级委派画在同一张图上。每个圆环是该会话的组成按其窗口占用缩放的结果；悬停看 token、请求数、计费与活跃时间；点击跳到该会话自己的 Context 标签。正在运行的 Agent 带绿色脉冲呼吸。

## ⌨️ `/context` 命令

输入 `/context`（或在 `/` 菜单里选它）后回车：

![Slash menu with the context command](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-command-entry.png)

弹出的居中对话框里有 **Current Composition** 卡片与 **Context 浏览器** —— 与标签页相同的组成条、逐步选择器和 `vs previous turn` 差量徽标：

![The /context modal](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-command.png)

## ⚙️ 设置

在 **设置 → 插件 → 插件配置** 里，**Context** 卡片保存本插件的每用户偏好 —— 默认趋势粒度（Step/Turn）、默认趋势模式（Total/Delta）与 File Activity 默认排序。图表内与卡片内的开关只作用于当前视图，不会覆盖已保存的偏好。

![The Context settings card](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/settings.png)

## 需要知道的

- **估算与实测** —— 分类数字用的是 dsh 自己的固定密度启发式（与内置 token meter 同一套）；钉住的趋势详情会在旁边给出提供方上报的实测值，Token 卡片把 ≈估算的组成占比与提供方精确的计费总量并列。
- **兼容性** —— 支持 `@deepseek-ai/dsh` **0.1.2-rc1+**，覆盖 V0（0.1.2-rc.x）、V2（0.1.3-alpha.x）与 V3（0.1.5-alpha.x+）三个会话日志世代。逐版本兼容矩阵与验证方式：[docs/compatibility.md](https://github.com/bowenliang123/dsh-context/blob/main/docs/compatibility.md)。
- **国际化** —— 界面支持 English 与 简体中文。

## 喜欢它？

如果 `dsh-context` 帮你搞清楚了 Agent 到底背着什么，欢迎在 [GitHub](https://github.com/bowenliang123/dsh-context) 上点个 ⭐ —— issue 与 PR 同样欢迎！

## 本地改动 / Local changes

本仓库只包含 `dsh-context` **v0.53.1** 的构建产物：两处代码修补落在 `lib/client.js`，另有一处打包调整（`package.json`）：

1. **侧边栏「上下文洞察」入口换位** —— `sidebar.footer.action` 席位上的 `context-overview` 注册，`order` 由 `10` 改为 `-1`，入口移到侧边栏底部动作区最前面，也就是费用插件「DeepSeek 开放平台账户余额」那一行**之上**（而不是紧贴「设置」）。
2. **底部动作区允许换行** —— 追加 `[class*=_footerActions]{flex-wrap:wrap}`。DSH 侧边栏把底部动作放在**单行 flex** 容器里，而每个动作自带整行宽度（`width:100%`），两个动作挤在同一行会互相压缩、标签被截断（表现为「上下文洞察」只剩一个「上」字贴在余额行右侧）；允许换行后，整行宽度的动作各占一行。
3. **去掉 `prepare` 脚本** —— 上游 `package.json` 里的 `"prepare": "husky && tsdown"` 会在 `dsh plugin add git+<本仓库>` 安装时自动执行；本仓库不含 `src/` 与构建工具链，这个脚本必然失败。删掉它之后，安装会直接使用随仓库发布的 `lib/`。

> 以上代码改动只落在构建产物上，未同步上游源码；上游发布新版本后需要在新构建上重新施加。

## 致谢 / Acknowledgments

- 原作者 / Original author：**bowenliang123**
- 上游仓库 / Upstream：<https://github.com/bowenliang123/dsh-context>
- 本修补版仓库 / This patched build：<https://github.com/ycm50/dsh-context>

本仓库的全部代码、文档与设计均来自上游 [`dsh-context`](https://github.com/bowenliang123/dsh-context)（v0.53.1），仅在上游构建产物上做了上面列出的修补。

## License

[Apache License 2.0](LICENSE) — Copyright 2025 **bowenliang123**。

本仓库是上游 [`dsh-context`](https://github.com/bowenliang123/dsh-context) v0.53.1 构建产物的本地修补版，代码与文档版权归原作者所有，按 Apache-2.0 分发；完整条款见仓库根目录的 [`LICENSE`](LICENSE)。
