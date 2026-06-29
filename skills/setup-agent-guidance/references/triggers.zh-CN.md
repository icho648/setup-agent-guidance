---
name: setup-agent-guidance-triggers-zh
description: Chinese-language trigger examples for the setup-agent-guidance skill. Loaded only when the user requests Chinese guidance or the project clearly uses Chinese.
---

# 中文触发条件

当用户的请求符合下面的描述时，调用 `setup-agent-guidance` skill：

- 为当前项目初始化或更新 Agent 指南 / Agent 协作规则
- 生成或刷新 `AGENTS.md`、`CLAUDE.md`、`.claude/CLAUDE.md`
- 引入执行计划规范（ExecPlan）或者安装 `PLANS.md`
- 制定代码审查标准（`code_review.md`）或测试规范
- 项目第一次接入 Claude Code / Codex / 其他 Agent 客户端，需要一套统一的协作约定
- 现有的项目 Agent 指南已经过时，需要重新梳理

不要在以下场景触发：

- 用户只是做普通功能开发、调试、重构，且项目 Agent 指南已经是最新的
- 用户只想临时问一个具体问题，并非要生成项目级规则
- 用户要求安装的是另一个 skill 或插件（如 OpenSpec、Spec Kit），与本 skill 的工作流无关