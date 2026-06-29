# setup-agent-guidance

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
.
├── SKILL.md                   # Agent Skills 必需入口
├── agents/
│   └── openai.yaml            # 可选 Codex 展示元数据
├── assets/                    # 多语言模板
├── references/                # 多语言建档流程
├── AGENTS.md                  # 供维护本仓库的编程 Agent 使用
├── CLAUDE.md                  # 导入同一份维护指令
├── README.md
├── README.zh-CN.md
└── LICENSE
```

仓库根目录就是可安装的 Skill 包。仓库根目录的维护文件会随 Skill 一起分发；目标项目模板放在 `assets/` 下。

## 安装

### 在 Codex 中从 GitHub 安装

在 Codex 中输入以下提示：

```text
使用 $skill-installer 安装
https://github.com/icho648/setup-agent-guidance
```

安装后重启 Codex，使其发现新 Skill。

### 手动安装

克隆仓库，然后把仓库目录复制或软链接到客户端支持的 Agent Skills 路径。

Codex，全局：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R /path/to/setup-agent-guidance "$HOME/.agents/skills/"
```

Codex，当前项目：

```bash
mkdir -p .agents/skills
cp -R /path/to/setup-agent-guidance .agents/skills/
```

Claude Code，全局：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R /path/to/setup-agent-guidance "$HOME/.claude/skills/"
```

Claude Code，当前项目：

```bash
mkdir -p .claude/skills
cp -R /path/to/setup-agent-guidance .claude/skills/
```

之后可以显式调用 `setup-agent-guidance`，也可以直接要求 Agent 初始化项目 Agent 指南。

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

使用 Agent Skills 项目的参考校验器：

```bash
python -m skills_ref.cli validate .
```

如果 Codex 开发环境自带 `skill-creator`，也可以使用其中的 `quick_validate.py` 校验目录。

发布前至少在全新会话中测试一个英文提示和一个中文提示。触发是否正确、执行结果是否正确要分别验证。

## 参考来源

- [Agent Skills 规范](https://agentskills.io/specification)
- [Codex 自定义与 Skills](https://developers.openai.com/codex/concepts/customization#skills)
- [OpenAI Codex ExecPlans 文章](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)

ExecPlan 模板改编自 OpenAI Cookbook 文章，并按照 `LICENSE` 中的 MIT 条款保留。

## 许可证

MIT，详见 [LICENSE](LICENSE)。
