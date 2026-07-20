# icho648-plugin

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[简体中文](README.zh-CN.md)

An installable Claude Code and Codex plugin bundling six portable Agent Skills by `icho648`: durable project guidance, grounded explanation, a complete PRD delivery loop, and evidence-based long-term learning.

## Skills

### setup-agent-guidance

Bootstraps durable project guidance without forcing every task through a heavyweight specification process. It installs a small workflow "gearbox" into the project's existing agent instructions, adds an ExecPlan standard when `PLANS.md` is absent, and optionally scans the repository to draft project-specific guidance and `code_review.md` with explicit user confirmation.

- Detects and updates existing `AGENTS.md`, `CLAUDE.md`, or `.claude/CLAUDE.md`; creates root `AGENTS.md` only when none exists.
- Adds four progressively stronger workflow gears: direct execution, plan first, ExecPlan, and existing specification governance.
- Preserves an existing `PLANS.md`; otherwise installs the selected English or Simplified Chinese template.
- Scans the repository read-only before proposing project-specific commands, conventions, and review gates.
- Never overwrites user-owned project guidance or `code_review.md` without confirmation.
- Uses instructions and templates only: no Python, shell script, package, or extra runtime is required.

### grounded-explainer

Explains an object's unique core and necessary implementation starting from a concrete scenario and the existing problem it solves. Triggered only by explicit invocation: `$grounded-explainer` in Codex or `/icho648-plugin:grounded-explainer` in Claude Code.

- Triggers only on explicit invocation; ordinary mentions of keywords or the skill name do not trigger it.
- After triggering, judges the object's true core in the current question, then decides whether to expand the implementation.
- Distinguishes the "ordinary capability of similar objects" from the "unique core in the current context", and states the difference.
- Starts from concrete scenarios, no concept tours; opens internal mechanisms with flowcharts, pseudocode, or precise code when needed.
- Length is driven by understanding, not minimization; preserves the complete explanation thread.

### write-prd

Creates or revises concise PRDs as durable product contracts rather than implementation plans.

- Separates facts, confirmed decisions, assumptions, open questions, and recommendations.
- Defines observable product behavior, invariants, hard constraints, autonomy boundaries, and traceable ACs.
- Uses the current workspace's conventions and writes Markdown by default unless the user requests chat-only output.

### implement-prd

Implements a confirmed PRD from a fixed Git baseline through review and evidence-backed acceptance.

- Produces a decision-complete Plan Mode plan when planning is requested.
- Maps product behavior and constraints to ACs, verification entries, and an independently reviewable Diff.
- Requires the `review-prd-implementation` loop before final checks and per-AC acceptance reporting.

### review-prd-implementation

Runs a read-only Standards / Spec review pair, lets only the main Agent revise the implementation, and reuses the original reviewers for closure.

- Keeps repository standards and the product contract on separate review axes.
- Tracks stable finding IDs, severity, evidence, disposition, focused rechecks, and unresolved decisions.
- Supports equivalent follow-up or resume mechanisms in Codex and Claude Code.

### learn

Maintains long-term learning state under `.learning/` and advances mastery only from evidence produced by the learner.

- Separates learning progress from demonstrated capability.
- Uses real tasks, retrieval, precise feedback, and transfer checks before raising mastery.
- Includes optional offline interactive-lesson assets when interaction materially improves practice.

## Repository layout

```text
plugins/icho648-plugin/
├── .claude-plugin/plugin.json   # Claude Code plugin manifest
├── .codex-plugin/plugin.json    # Codex plugin manifest
├── skills/
│   ├── setup-agent-guidance/    # Agent Skills package
│   ├── grounded-explainer/
│   ├── write-prd/
│   ├── implement-prd/
│   ├── review-prd-implementation/
│   └── learn/                   # Agent Skills packages
├── README.md
└── README.zh-CN.md
```

This plugin ships six Agent Skills packages under `skills/`. The repository-root Claude Code and Codex marketplace manifests both point at this plugin; see the root [README](../../README.md). Target-project templates live under `setup-agent-guidance`'s `assets/`.

## Install

### Install via the plugin marketplace (Claude Code)

```text
/plugin marketplace add icho648/skills
/plugin install icho648-plugin@icho648-skills
```

Restart Claude Code after installation so the new skills are discovered.

### Install via the marketplace (Codex)

```bash
codex plugin marketplace add icho648/skills
codex plugin add icho648-plugin@icho648-skills
```

Start a new Codex task after installation so the plugin skills are discovered.

### Manual installation

Clone the repository, then copy or symlink a skill package to an Agent Skills location supported by your client.

Claude Code, global:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/write-prd "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/implement-prd "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/review-prd-implementation "$HOME/.claude/skills/"
cp -R plugins/icho648-plugin/skills/learn "$HOME/.claude/skills/"
```

Codex, global:

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/write-prd "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/implement-prd "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/review-prd-implementation "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/learn "$HOME/.agents/skills/"
```

Plugin invocations are namespaced in Claude Code, for example `/icho648-plugin:implement-prd`; Codex uses `$implement-prd`. Manually installed standalone skills use `/implement-prd` in Claude Code.

To publish packaged `.skill` archives, trigger `.github/workflows/release.yml` from the Actions tab (workflow_dispatch) or push a `v*` tag; do not commit prebuilt archives into the repository.

## Portable Agent Skills format

Each skill follows the [Agent Skills specification](https://agentskills.io/specification):

- Each skill is a directory whose name matches the required `name` field.
- `SKILL.md` is required and begins with YAML frontmatter containing at least `name` and `description`.
- Names use lowercase letters, digits, and hyphens and are at most 64 characters.
- `description` states both capability and trigger conditions and is at most 1024 characters.
- `scripts/`, `references/`, and `assets/` are optional; this project intentionally uses only references and assets.
- Resource links are relative to the skill root and loaded progressively.

`agents/openai.yaml` is optional Codex presentation metadata. `.codex-plugin/plugin.json` packages the same portable skills for Codex without adding an MCP server, hook, app, or runtime.

## English and Chinese maintenance policy

Each skill keeps one identity and one canonical workflow in its `SKILL.md`. Localized user-facing resources use filename suffixes:

- English: `*.en.md` and `*.en.template.md`
- Simplified Chinese: `*.zh-CN.md` and `*.zh-CN.template.md`

`setup-agent-guidance` ships localized asset/reference pairs. The other skills are currently authored in Simplified Chinese and use language-neutral Agent Skills structure. When changing behavior, update both localized members of every affected pair in the same change and keep headings, managed markers, placeholders, and requirements in semantic lockstep.

## Validate

Using the reference validator from the Agent Skills project, run from the repository root:

```bash
for skill in plugins/icho648-plugin/skills/*; do
  python -m skills_ref.cli validate "$skill"
done
```

This repository also ships a GitHub Actions workflow at `.github/workflows/validate.yml` that runs the same check on every push and pull request, so PRs that break a skill will fail CI automatically.

A second workflow at `.github/workflows/release.yml` packages each skill as a `.skill` archive on `workflow_dispatch` or on every `v*` tag push, and attaches the archive to the matching GitHub Release.

## Sources

- [Agent Skills specification](https://agentskills.io/specification)
- [Codex plugin structure](https://learn.chatgpt.com/docs/build-plugins#plugin-structure)
- [OpenAI Codex ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code plugins](https://code.claude.com/docs/en/plugins)
- [Claude Code plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)

The ExecPlan templates are adapted from the OpenAI Cookbook article and retained under the MIT terms described in `LICENSE`.

## License

MIT. See [LICENSE](./LICENSE).
