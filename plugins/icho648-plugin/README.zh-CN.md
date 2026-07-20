# icho648-plugin

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[English](README.md)

一个可安装的 Claude Code 与 Codex 插件，打包 `icho648` 的六个便携 Agent Skills：持久项目指南、落地解释、完整 PRD 交付闭环，以及基于证据的长期学习。

## 技能

### setup-agent-guidance

用来为代码项目初始化长期有效的 Agent 指南，同时避免把每个任务都强制塞进重量级规格流程。它会把渐进式“工作流变速箱”安装到项目已有的 Agent 指令中；缺少 `PLANS.md` 时补充 ExecPlan 规范；还可以只读通览仓库，在用户明确确认后生成项目专属指南和 `code_review.md`。

- 检测并更新已有的 `AGENTS.md`、`CLAUDE.md` 或 `.claude/CLAUDE.md`；只有都不存在时才创建根目录 `AGENTS.md`。
- 安装四档渐进工作流：直接执行、先规划、ExecPlan、沿用项目已有规格治理。
- 完整保留已有 `PLANS.md`；不存在时才按语言安装英文或简体中文模板。
- 先只读扫描仓库，再提出项目命令、工程约定和 Review 门禁。
- 未经确认，不覆盖用户拥有的项目指南或 `code_review.md`。
- 只有指令和模板，不依赖 Python、Shell 脚本、第三方包或额外运行时。

### grounded-explainer

从具体场景和既有问题出发，完整解释对象的独特核心与必要实现机制。仅在显式调用时触发：Codex 为 `$grounded-explainer`，Claude Code 为 `/icho648-plugin:grounded-explainer`。

- 仅在用户显式调用时触发；普通提及关键词或技能名都不算。
- 触发后先判断当前问题中对象的真正核心，再决定是否展开实现。
- 区分“同类对象的普通能力”与“当前语境中的独特核心”，并明确说出判断。
- 从具体场景讲起，不做概念巡礼；必要时用流程图、伪代码或精确代码打开对象内部机制。
- 长度由理解需要决定，而不是追求最短；保留完整解释主线。

### write-prd

把 PRD 创建或修订为简洁、持久的产品契约，而不是实施计划。

- 分开事实、已确认决策、假设、待定问题和建议。
- 定义可观察产品行为、不变量、硬约束、自治边界和可追溯 AC。
- 遵循当前工作区惯例；除非用户只要聊天内容，否则默认写入 Markdown。

### implement-prd

从固定 Git 基线开始实施已确认 PRD，并经过审阅和有证据的验收。

- 在 Plan Mode 下生成决策完整、便于理解的实施计划。
- 把产品行为和约束映射到 AC、验证入口和可独立审阅的 Diff。
- 最终检查和逐条 AC 验收前，强制执行 `review-prd-implementation` 闭环。
- `review-prd-implementation` 是硬依赖：以独立 `.skill` 归档安装 `implement-prd` 时，必须同时安装 `review-prd-implementation`，否则强制审阅步骤无法运行。

### review-prd-implementation

并行执行只读 Standards / Spec 双轴审阅，只允许主 Agent 修改实现，并复用原审阅 Agent 完成闭环。

- 分开仓库规范和产品契约两个审阅轴。
- 记录稳定 finding 编号、严重度、证据、处置、定向检查和待决策项。
- 在 Codex 与 Claude Code 中使用各自可用的 follow-up 或 resume 等价机制。

### learn

在 `.learning/` 下维护长期学习状态，并且只根据学习者实际产出的证据提高能力等级。

- 分开学习进度与已经证明的能力。
- 通过真实任务、检索、精确反馈和迁移检查推进掌握。
- 只有交互明显改善练习时，才使用随 Skill 提供的离线交互课程资源。

## 仓库结构

```text
plugins/icho648-plugin/
├── .claude-plugin/plugin.json   # Claude Code 插件清单
├── .codex-plugin/plugin.json    # Codex 插件清单
├── skills/
│   ├── setup-agent-guidance/    # Agent Skills 包
│   ├── grounded-explainer/
│   ├── write-prd/
│   ├── implement-prd/
│   ├── review-prd-implementation/
│   └── learn/                   # Agent Skills 包
├── README.md
└── README.zh-CN.md
```

本插件在 `skills/` 下提供六个 Agent Skills 包。仓库根的 Claude Code 与 Codex 市场清单都指向这个插件，详见仓库根 [README](../../README.zh-CN.md)。目标项目模板放在 `setup-agent-guidance` 的 `assets/` 下。

## 安装

### 通过插件市场安装（Claude Code）

```text
/plugin marketplace add icho648/skills
/plugin install icho648-plugin@icho648-skills
```

安装后重启 Claude Code，以便发现新技能。

### 通过市场安装（Codex）

```bash
codex plugin marketplace add icho648/skills
codex plugin add icho648-plugin@icho648-skills
```

安装后新建一个 Codex 任务，使其发现插件中的技能。

### 手动安装

克隆仓库，然后把技能包复制或软链接到客户端支持的 Agent Skills 路径。

Claude Code 全局：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/write-prd "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/implement-prd "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/review-prd-implementation "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/learn "$HOME/.claude/skills/"
```

Codex 全局：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/write-prd "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/implement-prd "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/review-prd-implementation "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/learn "$HOME/.agents/skills/"
```

插件安装时，Claude Code 使用带命名空间的入口，例如 `/icho648-plugin:implement-prd`；Codex 使用 `$implement-prd`。手动安装为独立 Skill 时，Claude Code 使用 `/implement-prd`。

发布 `.skill` 归档时，请在 Actions 页面手动触发 `.github/workflows/release.yml`（workflow_dispatch），或推送 `v*` tag；不要把预打包产物提交到仓库。

## 通用 Agent Skills 格式

每个技能遵循 [Agent Skills 规范](https://agentskills.io/specification)：

- 每个 Skill 是一个独立目录，目录名必须与 `name` 相同。
- 必须包含 `SKILL.md`，并以 YAML frontmatter 开头，至少包含 `name` 和 `description`。
- 名称只使用小写字母、数字和连字符，最长 64 个字符。
- `description` 同时说明“做什么”和“何时触发”，最长 1024 个字符。
- `scripts/`、`references/`、`assets/` 都是可选目录；本项目刻意只使用 references 和 assets。
- 资源使用相对 Skill 根目录的路径，并按需渐进加载。

`agents/openai.yaml` 只是可选的 Codex 展示元数据。`.codex-plugin/plugin.json` 将同一组便携技能包装给 Codex，不额外引入 MCP、Hook、App 或运行时。

## 中英文维护策略

每个技能保持单一身份和单一规范工作流（在其 `SKILL.md` 中）。本地化用户资源用文件名后缀区分：

- 英文：`*.en.md` 与 `*.en.template.md`
- 简体中文：`*.zh-CN.md` 与 `*.zh-CN.template.md`

`setup-agent-guidance` 提供本地化的 asset/reference 配对；其他技能目前以简体中文编写，并使用语言中立的 Agent Skills 目录结构。改动行为时，同一改动内更新每一对受影响的本地化资源，并保持标题、受管标记、占位符与要求在语义上同步。

## 校验

使用 Agent Skills 项目的参考校验器，在仓库根目录执行：

```bash
for skill in plugins/icho648-plugin/skills/*; do
  python -m skills_ref.cli validate "$skill"
done
```

仓库自带的 `.github/workflows/validate.yml` 会在每次 push 与 PR 时运行同样的检查，破坏 Skill 的改动会被 CI 自动拦截。

另一份 `.github/workflows/release.yml` 在手动触发（workflow_dispatch）或推送 `v*` tag 时把每个 Skill 打包成 `.skill` 归档，并附到对应的 GitHub Release。

## 参考来源

- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 插件结构](https://learn.chatgpt.com/docs/build-plugins#plugin-structure)
- [OpenAI Codex ExecPlans 文章](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code 插件](https://code.claude.com/docs/zh-CN/plugins)
- [Claude Code 插件市场](https://code.claude.com/docs/zh-CN/plugin-marketplaces)

ExecPlan 模板改编自 OpenAI Cookbook 文章，并按照 `LICENSE` 中的 MIT 条款保留。

## 许可证

MIT，详见 [LICENSE](./LICENSE)。
