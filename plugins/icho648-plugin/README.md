# icho648-plugin

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[简体中文](README.zh-CN.md)

An installable Claude Code and Codex plugin bundling two portable Agent Skills by `icho648`: durable project agent guidance setup, and grounded explanation.

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

Explains an object's unique core and necessary implementation starting from a concrete scenario and the existing problem it solves. Triggered only by explicit invocation: `$grounded-explainer` in Codex or `/grounded-explainer:grounded-explainer` in Claude Code.

- Triggers only on explicit invocation; ordinary mentions of keywords or the skill name do not trigger it.
- After triggering, judges the object's true core in the current question, then decides whether to expand the implementation.
- Distinguishes the "ordinary capability of similar objects" from the "unique core in the current context", and states the difference.
- Starts from concrete scenarios, no concept tours; opens internal mechanisms with flowcharts, pseudocode, or precise code when needed.
- Length is driven by understanding, not minimization; preserves the complete explanation thread.

## Repository layout

```text
plugins/icho648-plugin/
├── .claude-plugin/plugin.json   # Claude Code plugin manifest
├── .codex-plugin/plugin.json    # Codex plugin manifest
├── skills/
│   ├── setup-agent-guidance/    # Agent Skills package
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml   # optional Codex UI metadata
│   │   ├── assets/              # localized templates
│   │   └── references/          # localized onboarding procedure
│   └── grounded-explainer/      # Agent Skills package
│       ├── SKILL.md
│       ├── references/explanation-workflow.md
│       └── agents/openai.yaml
├── README.md
└── README.zh-CN.md
```

This plugin ships two Agent Skills packages under `skills/`. The repository-root Claude Code and Codex marketplace manifests both point at this plugin; see the root [README](../../README.md). Target-project templates live under `setup-agent-guidance`'s `assets/`.

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
```

Codex, global:

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/icho648-plugin/skills/setup-agent-guidance "$HOME/.agents/skills/"
cp -R plugins/icho648-plugin/skills/grounded-explainer "$HOME/.agents/skills/"
```

Then invoke a skill explicitly (`$setup-agent-guidance` or `$grounded-explainer`), or ask the agent to initialize project agent guidance.

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

`setup-agent-guidance` ships localized asset/reference pairs. `grounded-explainer` is authored in Simplified Chinese. When changing behavior, update both localized members of every affected pair in the same change and keep headings, managed markers, placeholders, and requirements in semantic lockstep.

## Validate

Using the reference validator from the Agent Skills project, run from the repository root:

```bash
python -m skills_ref.cli validate plugins/icho648-plugin/skills/setup-agent-guidance
python -m skills_ref.cli validate plugins/icho648-plugin/skills/grounded-explainer
```

This repository also ships a GitHub Actions workflow at `.github/workflows/validate.yml` that runs the same check on every push and pull request, so PRs that break a skill will fail CI automatically.

A second workflow at `.github/workflows/release.yml` packages each skill as a `.skill` archive on `workflow_dispatch` or on every `v*` tag push, and attaches the archive to the matching GitHub Release.

## Sources

- [Agent Skills specification](https://agentskills.io/specification)
- [Codex customization and skills](https://developers.openai.com/codex/concepts/customization#skills)
- [OpenAI Codex ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code skills](https://code.claude.com/docs/en/skills)

The ExecPlan templates are adapted from the OpenAI Cookbook article and retained under the MIT terms described in `LICENSE`.

## License

MIT. See [LICENSE](./LICENSE).
