# icho648-skills

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](./.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[English](README.md)

一个可搜索的 Claude Code 与 Codex **插件市场**，托管 `icho648` 的便携 Agent Skills。把本仓库添加为市场后，安装插件即可获得全部六个技能。

## 插件

| 插件 | 技能 | 作用 |
| --- | --- | --- |
| [icho648-plugin](plugins/icho648-plugin/) | `setup-agent-guidance`、`grounded-explainer`、`write-prd`、`implement-prd`、`review-prd-implementation`、`learn` | 设置持久 Agent 指南；从具体场景解释技术对象；通过有证据的闭环编写、实施和审阅 PRD；并用真实练习与已证明的掌握程度维护长期学习状态。 |

## 安装

### 添加市场并安装插件（Claude Code）

```text
/plugin marketplace add icho648/skills
/plugin install icho648-plugin@icho648-skills
```

或通过 CLI：

```bash
claude plugin marketplace add icho648/skills
claude plugin install icho648-plugin@icho648-skills
```

安装后重启 Claude Code，以便发现新技能。

### 添加市场并安装插件（Codex）

```bash
codex plugin marketplace add icho648/skills
codex plugin add icho648-plugin@icho648-skills
```

安装后新建一个 Codex 任务，使其发现插件中的技能。

### 手动安装

每个技能都是 `plugins/icho648-plugin/skills/<名>/` 下的便携 Agent Skills 包。克隆仓库后，把技能目录复制或软链到客户端扫描的位置。

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

插件安装时，Claude Code 使用带命名空间的入口，例如 `/icho648-plugin:write-prd`；Codex 使用 `$write-prd`。手动安装为独立 Skill 时，Claude Code 使用 `/write-prd`。

## 仓库结构

```text
.
├── .claude-plugin/
│   └── marketplace.json          # Claude Code 市场清单
├── .agents/plugins/
│   └── marketplace.json          # Codex 市场清单
├── plugins/
│   └── icho648-plugin/
│       ├── .claude-plugin/plugin.json
│       ├── .codex-plugin/plugin.json
│       ├── skills/
│       │   ├── setup-agent-guidance/
│       │   ├── grounded-explainer/
│       │   ├── write-prd/
│       │   ├── implement-prd/
│       │   ├── review-prd-implementation/
│       │   └── learn/                      # Agent Skills 包
│       ├── README.md
│       └── README.zh-CN.md
├── .github/                      # 工作流与仓库校验器
├── tests/                        # 校验器回归测试
├── AGENTS.md                     # 仓库维护说明
├── CLAUDE.md                     # 引用同一份维护说明
├── README.md
├── README.zh-CN.md
└── LICENSE
```

仓库根是**市场**。每个 `plugins/<名>/` 目录同时是 Claude Code 与 Codex 插件，内含一个或多个 Agent Skills 包（位于 `skills/<名>/`）。

## 三套兼容标准

- **Claude Code 插件市场。** `.claude-plugin/marketplace.json` 注册市场，并用本地 `source` 路径列出每个插件；每个插件有 `.claude-plugin/plugin.json` 清单。这让技能可通过 `/plugin` 被搜索和安装。
- **Codex 插件市场。** `.agents/plugins/marketplace.json` 为 Codex 注册相同的插件根目录；每个插件用 `.codex-plugin/plugin.json` 指向已有的 `skills/` 目录。
- **Agent Skills 规范。** 每个 `skills/<名>/` 目录是独立、跨客户端的 Agent Skills 包（`SKILL.md` + 可选 `assets/`、`references/`、`agents/`），用 `skills-ref` 校验。Codex 等 Agent Skills 客户端可绕过插件外壳直接使用。

`agents/openai.yaml` 是可选的 Codex 呈现元数据，其他 Agent Skills 客户端可忽略。

## 中英文维护策略

每个技能保持单一身份和单一规范工作流（在其 `SKILL.md` 中）。本地化用户资源用文件名后缀区分：

- 英文：`*.en.md` 与 `*.en.template.md`
- 简体中文：`*.zh-CN.md` 与 `*.zh-CN.template.md`

`setup-agent-guidance` 提供本地化的 asset/reference 配对；其他技能目前以简体中文编写，并使用语言中立的 Agent Skills 目录结构。改动行为时，同一改动内更新每一对受影响的本地化资源，并保持标题、受管标记、占位符与要求在语义上同步。

## 校验

使用 Agent Skills 项目的参考校验器：

```bash
for skill in plugins/icho648-plugin/skills/*; do
  python -m skills_ref.cli validate "$skill"
done
```

本仓库还附带 `.github/workflows/validate.yml`，在每次 push 和 pull request 时校验所有技能、两种市场格式、Codex 插件清单、本地化资源配对与相对路径引用。

另一份 `.github/workflows/release.yml` 在 `workflow_dispatch` 或每次 `v*` 标签推送时为每个技能构建 `.skill` 归档，并附到对应的 GitHub Release。手动运行用于不打标签产出预发布制品；标签流程用于永久版本发布。

## 参考

- [Claude Code 插件](https://code.claude.com/docs/zh-CN/plugins)
- [Claude Code 插件市场](https://code.claude.com/docs/zh-CN/plugin-marketplaces)
- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 定制与技能](https://developers.openai.com/codex/concepts/customization#skills)
- [Claude Code 技能](https://code.claude.com/docs/zh-CN/skills)

## 许可

MIT。见 [LICENSE](LICENSE)。
