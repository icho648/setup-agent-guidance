# icho648-plugin

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[English](README.md)

一个可安装的 Claude Code 与 Codex 插件，打包 `icho648` 的两个便携 Agent Skills：持久项目代理指导设置，以及落地解释。

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

## 仓库结构

```text
plugins/icho648-plugin/
├── .claude-plugin/plugin.json   # Claude Code 插件清单
├── .codex-plugin/plugin.json    # Codex 插件清单
├── skills/
│   ├── setup-agent-guidance/    # Agent Skills 包
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml   # 可选 Codex UI 元数据
│   │   ├── assets/              # 本地化模板
│   │   └── references/          # 本地化上手流程
│   └── grounded-explainer/      # Agent Skills 包
│       ├── SKILL.md
│       ├── references/explanation-workflow.md
│       └── agents/openai.yaml
├── README.md
└── README.zh-CN.md
```

本插件在 `skills/` 下提供两个 Agent Skills 包。仓库根的 Claude Code 与 Codex 市场清单都指向这个插件，详见仓库根 [README](../../README.zh-CN.md)。目标项目模板放在 `setup-agent-guidance` 的 `assets/` 下。

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
```

Codex 全局：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.agents/skills/"
```

随后显式调用技能（Claude Code：`/setup-agent-guidance` 或 `/grounded-explainer`；Codex：`$setup-agent-guidance` 或 `$grounded-explainer`），也可以直接要求 Agent 初始化项目 Agent 指南。

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

`setup-agent-guidance` 提供本地化的 asset/reference 配对；`grounded-explainer` 以简体中文撰写。改动行为时，同一改动内更新每一对受影响的本地化资源，并保持标题、受管标记、占位符与要求在语义上同步。

## 校验

使用 Agent Skills 项目的参考校验器，在仓库根目录执行：

```bash
python -m skills_ref.cli validate plugins/icho648-plugin/skills/setup-agent-guidance
python -m skills_ref.cli validate plugins/icho648-plugin/skills/grounded-explainer
```

仓库自带的 `.github/workflows/validate.yml` 会在每次 push 与 PR 时运行同样的检查，破坏 Skill 的改动会被 CI 自动拦截。

另一份 `.github/workflows/release.yml` 在手动触发（workflow_dispatch）或推送 `v*` tag 时把每个 Skill 打包成 `.skill` 归档，并附到对应的 GitHub Release。

## 参考来源

- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 自定义与 Skills](https://developers.openai.com/codex/concepts/customization#skills)
- [OpenAI Codex ExecPlans 文章](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)

ExecPlan 模板改编自 OpenAI Cookbook 文章，并按照 `LICENSE` 中的 MIT 条款保留。

## 许可证

MIT，详见 [LICENSE](./LICENSE)。
