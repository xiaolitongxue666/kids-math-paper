# PROJECT_MEMORY — kids-math-paper

> 项目级记忆（仅本仓库）。最后更新：2026-07-01

## 架构要点

1. **单文件应用**：全部逻辑内联于 `index.html`（Engine / PrintLayout / app 三段 IIFE），无外部依赖。
2. **README 结构说明已过时**：实际无独立 `css/`、`js/` 目录；以 `index.html` 为准。
3. **打开方式**：双击 `index.html` 或 Cursor Simple Browser；纯静态，无需本地 server。
4. **Cursor Browser MCP**：不支持 `file://`，Agent 自动化预览需 HTTP；用户本地直接打开即可。

## 题目生成（Engine）

5. **难度范围**：`range20`（1–20）、`range50`（10–50）、`range100`（50–99）。
6. **进位加法**：个位相加 ≥ 10；`genCarryAdd()` 构造，`tag:'carry'`。
7. **借位减法**：被减数个位 < 减数个位且被减数更大；`genBorrowSub()` 构造，`tag:'borrow'`。
8. **比例控制**：`carryPct` / `borrowPct`（0–100%，默认 10%）；仅勾选加法/减法时对应比例生效。
9. **比例上限**：`carryCount + borrowCount > count` 时压缩借位数量，避免超出总题量。
10. **槽位分配**：shuffle 索引后预留进位/借位槽，其余按题型轮询 `genQ()`。
11. **随机种子**：有 seed 时题目可复现；切换「显示提示」不重生成，只重渲染 `lastQs`。

## UI / 渲染

12. **显示提示**：`#showHint` 控制题旁蓝色「进位」「借位」标签；关闭后题目不变。
13. **进位/借位比例**：`#carryPct`、`#borrowPct` 数字输入；修改后需点「重新生成」。
14. **打印**：工具栏 `@media print` 隐藏；A4 分页由 `PrintLayout.renderAll` 处理。

## 问题与解法

| 问题 | 解法 |
|------|------|
| Agent 无法用 Browser 打开本地 HTML | MCP 禁止 `file://`；用户用系统浏览器或 Simple Browser |
| 启动 HTTP server 命令失败 | 路径被截断；本项目不需要 server |
| README 仍描述多文件结构 | 已单文件化（commit f9d8457）；文档需与 `index.html` 同步 |

## 维护备注

- 仓库极小（`index.html`、`README.md`、`math.png`、`.gitignore`），无 logs/cache/备份目录。
- 无 `AGENTS.md`、无平台 `agent.md`；无需跨平台 agent 配置同步。
