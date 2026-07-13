# setup-agent-guidance

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[English](README.md)

这是一个可安装的 Agent Skill，用来为代码项目初始化长期有效的 Agent 指南，同时避免把每个任务都强制塞进重量级规格流程。

它会把渐进式“工作流变速箱”安装到项目已有的 Agent 指令中；缺少 `PLANS.md` 时补充 ExecPlan 规范；还可以只读通览仓库，在用户明确确认后生成项目专属指南和 `code_review.md`。

## 它会做什么

- 检测并更新已有的 `AGENTS.md`、`CLAUDE.md` 或 `.claude/CLAUDE.md`；只有都不存在时才创建根目录 `AGENTS.md`。
- 安装四档渐进工作流：直接执行、先规划、ExecPlan、沿用项目已有规格治理。
- 完整保留已有 `PLANS.md`；不存在时才按语言安装英文或简体中文模板。
- 先只读扫描仓库，再提出项目命令、工程约定和 Review 门禁。
- 未经确认，不覆盖用户拥有的项目指南或 `code_review.md`。
- 只有指令和模板，不依赖 Python、Shell 脚本、第三方包或额外运行时。

## 仓库结构

```text
plugins/setup-agent-guidance/
├── .claude-plugin/plugin.json   # Claude Code 插件清单
├── skills/setup-agent-guidance/ # Agent Skills 包
│   ├── SKILL.md                 # Agent Skills 必需入口
│   ├── agents/openai.yaml       # 可选 Codex 展示元数据
│   ├── assets/                  # 多语言模板
│   └── references/              # 多语言建档流程
├── README.md
└── README.zh-CN.md
```

本插件在 `skills/setup-agent-guidance/` 下提供唯一的 Agent Skills 包。让它可安装的市场清单位于仓库根目录的 `.claude-plugin/marketplace.json`，详见仓库根 [README](../../README.zh-CN.md)。目标项目模板放在技能的 `assets/` 下。

## 安装

### 通过插件市场安装（Claude Code）

```text
/plugin marketplace add icho648/skills
/plugin install setup-agent-guidance@icho648-skills
```

安装后重启 Claude Code，使其发现新技能。

### 在 Codex 中从 GitHub 安装

在 Codex 中输入以下提示：

```text
使用 $skill-installer 安装
https://github.com/icho648/skills/tree/main/plugins/setup-agent-guidance/skills/setup-agent-guidance
```

安装后重启 Codex，使其发现新 Skill。

### 手动安装

克隆仓库，然后把技能包复制或软链接到客户端支持的 Agent Skills 路径。

Codex，全局：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.agents/skills/"
```

Claude Code，全局：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.claude/skills/"
```

之后可以显式调用 `setup-agent-guidance`，也可以直接要求 Agent 初始化项目 Agent 指南。

发布 `.skill` 归档时，请在 Actions 页面手动触发 `.github/workflows/release.yml`（workflow_dispatch），或推送 `v*` tag；不要把预打包产物提交到仓库。

## 通用 Agent Skills 格式

本项目遵循 [Agent Skills 规范](https://agentskills.io/specification)：

- 每个 Skill 是一个独立目录，目录名必须与 `name` 相同。
- 必须包含 `SKILL.md`，并以 YAML frontmatter 开头，至少包含 `name` 和 `description`。
- 名称只使用小写字母、数字和连字符，最长 64 个字符。
- `description` 同时说明“做什么”和“何时触发”，最长 1024 个字符。
- `scripts/`、`references/`、`assets/` 都是可选目录；本项目刻意只使用 references 和 assets。
- 资源使用相对 Skill 根目录的路径，并按需渐进加载。

`agents/openai.yaml` 只是可选的 Codex 展示元数据，其他 Agent Skills 客户端可以忽略。这里没有包装成 Codex Plugin，因为当前工作流不需要 MCP、Hook、App 等插件专属能力。

## 中英文维护策略

仓库只维护一个 Skill ID，并在 `SKILL.md` 中维护一份行为逻辑。面向用户的多语言资源使用文件名后缀：

- 英文：`*.en.md`、`*.en.template.md`
- 简体中文：`*.zh-CN.md`、`*.zh-CN.template.md`

运行时根据现有项目指令语言、用户明确指定的语言或当前请求语言选择 locale，并且只读取该语言资源。这样不会产生两份重复的触发描述，也不会把未使用的翻译装入上下文。

修改行为时：

1. `SKILL.md` 只修改一次。
2. 在同一个提交中同步更新所有受影响的中英文资源对。
3. 两个版本的标题结构、managed markers、占位符和要求保持一致。
4. 中英文语义等价即可，不要求逐行硬译。
5. 提交前运行校验，并人工审查双语 diff。

这种“一份行为逻辑 + 本地化资源”的方式优于发布两个独立 Skill：两个相似 Skill 会竞争同一类请求，而且更容易随时间发生功能漂移。

## 校验

使用 Agent Skills 项目的参考校验器，在仓库根目录执行：

```bash
python -m skills_ref.cli validate plugins/setup-agent-guidance/skills/setup-agent-guidance
```

如果 Codex 开发环境自带 `skill-creator`，也可以使用其中的 `quick_validate.py` 校验目录。

仓库自带的 `.github/workflows/validate.yml` 会在每次 push 与 PR 时运行同样的检查，破坏 Skill 的改动会被 CI 自动拦截。

另外还有 `.github/workflows/release.yml`：在手动触发（workflow_dispatch）或推送 `v*` tag 时把 Skill 打包成 `.skill` 归档，并把它作为附件挂到对应的 GitHub Release。手动触发用于不打 tag 就拿到预发布产物；tag 触发用于发布正式版本。

发布前至少在全新会话中测试一个英文提示和一个中文提示。触发是否正确、执行结果是否正确要分别验证。

中文触发条件位于 `skills/setup-agent-guidance/references/triggers.zh-CN.md`，仅当项目或用户请求使用中文时加载。`SKILL.md` 中的英文 `description` 引用该文件，使 frontmatter 保持单一语言。

## 参考来源

- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 自定义与 Skills](https://developers.openai.com/codex/concepts/customization#skills)
- [OpenAI Codex ExecPlans 文章](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)

ExecPlan 模板改编自 OpenAI Cookbook 文章，并按照 `LICENSE` 中的 MIT 条款保留。

## 许可证

MIT，详见 [LICENSE](./LICENSE)。
