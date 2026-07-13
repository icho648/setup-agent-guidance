# icho648-skills

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](./.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[English](README.md)

一个可搜索的 Claude Code **插件市场**，托管 `icho648` 的便携 Agent Skills。把本仓库添加为市场后，即可把任意技能作为插件安装。

## 插件

| 插件 | 技能 | 作用 |
| --- | --- | --- |
| [setup-agent-guidance](plugins/setup-agent-guidance/) | `setup-agent-guidance` | 初始化或刷新持久的项目代理指导：检测 `AGENTS.md`/`CLAUDE.md`，安装渐进式工作流和 `PLANS.md`，然后只读扫描仓库，在用户确认后生成项目专属规则与 `code_review.md`。 |
| [grounded-explainer](plugins/grounded-explainer/) | `grounded-explainer` | 从具体场景和既有问题出发，完整解释对象的独特核心与必要实现机制。仅在显式调用 `$grounded-explainer` 时触发。 |

## 安装

### 添加市场并安装插件（Claude Code）

```text
/plugin marketplace add icho648/skills
/plugin install setup-agent-guidance@icho648-skills
/plugin install grounded-explainer@icho648-skills
```

或通过 CLI：

```bash
claude plugin marketplace add icho648/skills
claude plugin install setup-agent-guidance@icho648-skills
```

安装后重启 Claude Code，以便发现新技能。

### 手动安装

每个插件的技能都是 `plugins/<名>/skills/<名>/` 下的便携 Agent Skills 包。克隆仓库后，把技能目录复制或软链到客户端扫描的位置。

Claude Code 全局：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.claude/skills/"
cp -R plugins/grounded-explainer/skills/grounded-explainer "$HOME/.claude/skills/"
```

Codex 全局：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.agents/skills/"
```

随后显式调用技能（`$setup-agent-guidance` 或 `$grounded-explainer`）。

## 仓库结构

```text
.
├── .claude-plugin/
│   └── marketplace.json          # Claude Code 市场清单
├── plugins/
│   ├── setup-agent-guidance/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/setup-agent-guidance/   # Agent Skills 包
│   │   │   ├── SKILL.md
│   │   │   ├── agents/openai.yaml          # 可选 Codex UI 元数据
│   │   │   ├── assets/                     # 本地化模板
│   │   │   └── references/                 # 本地化上手流程
│   │   ├── README.md
│   │   └── README.zh-CN.md
│   └── grounded-explainer/
│       ├── .claude-plugin/plugin.json
│       └── skills/grounded-explainer/
│           ├── SKILL.md
│           └── agents/openai.yaml
├── .github/workflows/            # validate.yml 与 release.yml
├── AGENTS.md                     # 仓库维护说明
├── CLAUDE.md                     # 引用同一份维护说明
├── README.md
├── README.zh-CN.md
└── LICENSE
```

仓库根是**市场**。每个 `plugins/<名>/` 目录是一个 Claude Code 插件，内含恰好一个 Agent Skills 包（位于 `skills/<名>/`）。

## 两套兼容标准

- **Claude Code 插件市场。** `.claude-plugin/marketplace.json` 注册市场，并用本地 `source` 路径列出每个插件；每个插件有 `.claude-plugin/plugin.json` 清单。这让技能可通过 `/plugin` 被搜索和安装。
- **Agent Skills 规范。** 每个 `skills/<名>/` 目录是独立、跨客户端的 Agent Skills 包（`SKILL.md` + 可选 `assets/`、`references/`、`agents/`），用 `skills-ref` 校验。Codex 等 Agent Skills 客户端可绕过插件外壳直接使用。

`agents/openai.yaml` 是可选的 Codex 呈现元数据，其他 Agent Skills 客户端可忽略。

## 中英文维护策略

每个技能保持单一身份和单一规范工作流（在其 `SKILL.md` 中）。本地化用户资源用文件名后缀区分：

- 英文：`*.en.md` 与 `*.en.template.md`
- 简体中文：`*.zh-CN.md` 与 `*.zh-CN.template.md`

`setup-agent-guidance` 提供本地化的 asset/reference 配对；`grounded-explainer` 以简体中文撰写。改动行为时，同一改动内更新每一对受影响的本地化资源，并保持标题、受管标记、占位符与要求在语义上同步。

## 校验

使用 Agent Skills 项目的参考校验器：

```bash
python -m skills_ref.cli validate plugins/setup-agent-guidance/skills/setup-agent-guidance
python -m skills_ref.cli validate plugins/grounded-explainer/skills/grounded-explainer
```

本仓库还附带 `.github/workflows/validate.yml`，在每次 push 和 pull request 时校验所有技能与市场清单，破坏技能或市场的 PR 会自动失败 CI。

另一份 `.github/workflows/release.yml` 在 `workflow_dispatch` 或每次 `v*` 标签推送时为每个技能构建 `.skill` 归档，并附到对应的 GitHub Release。手动运行用于不打标签产出预发布制品；标签流程用于永久版本发布。

## 参考

- [Claude Code 插件与市场](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 定制与技能](https://developers.openai.com/codex/concepts/customization#skills)
- [Claude Code 技能](https://code.claude.com/docs/en/skills)

## 许可

MIT。见 [LICENSE](LICENSE)。
