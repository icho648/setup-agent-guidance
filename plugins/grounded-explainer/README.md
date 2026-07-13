# grounded-explainer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

落地解释器 —— 从具体场景和既有问题出发，完整解释对象的独特核心与必要实现机制。

## 它做什么

- 仅在用户**显式调用 `$grounded-explainer`** 时触发；不允许隐式触发，普通提及关键词或技能名都不算。
- 触发后先判断当前问题中对象的真正核心，再决定是否展开实现。
- 区分“同类对象的普通能力”与“当前语境中的独特核心”，并明确说出判断。
- 从具体场景讲起，不做概念巡礼；必要时用流程图、伪代码或精确代码打开对象内部机制。
- 长度由理解需要决定，而不是追求最短；保留完整解释主线。

## 触发方式

```
$grounded-explainer <要解释的对象>
```

## 安装

通过 `icho648-skills` 插件市场安装（见仓库根 [README](../../README.md)）：

```
/plugin marketplace add icho648/skills
/plugin install grounded-explainer@icho648-skills
```

也可手动复制或软链 `skills/grounded-explainer/` 到客户端的技能目录。

## 结构

```text
skills/grounded-explainer/
├── SKILL.md          # 技能入口（中文）
└── agents/openai.yaml # 可选 Codex UI 元数据
```

## 许可

MIT。见 [LICENSE](./LICENSE)。
