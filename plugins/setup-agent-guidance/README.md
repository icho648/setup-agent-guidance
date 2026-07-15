# setup-agent-guidance

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](../../.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[简体中文](README.zh-CN.md)

An installable Agent Skill that bootstraps durable project guidance without forcing every task through a heavyweight specification process.

It installs a small workflow “gearbox” into the project's existing agent instructions, adds an ExecPlan standard when `PLANS.md` is absent, and optionally scans the repository to draft project-specific guidance and `code_review.md` with explicit user confirmation.

## What it does

- Detects and updates existing `AGENTS.md`, `CLAUDE.md`, or `.claude/CLAUDE.md`; creates root `AGENTS.md` only when none exists.
- Adds four progressively stronger workflow gears: direct execution, plan first, ExecPlan, and existing specification governance.
- Preserves an existing `PLANS.md`; otherwise installs the selected English or Simplified Chinese template.
- Scans the repository read-only before proposing project-specific commands, conventions, and review gates.
- Never overwrites user-owned project guidance or `code_review.md` without confirmation.
- Uses instructions and templates only: no Python, shell script, package, or extra runtime is required.

## Repository layout

```text
plugins/setup-agent-guidance/
├── .claude-plugin/plugin.json   # Claude Code plugin manifest
├── .codex-plugin/plugin.json    # Codex plugin manifest
├── skills/setup-agent-guidance/ # the Agent Skills package
│   ├── SKILL.md                 # required Agent Skills entry point
│   ├── agents/openai.yaml       # optional Codex UI metadata
│   ├── assets/                  # localized templates
│   └── references/              # localized onboarding procedure
├── README.md
└── README.zh-CN.md
```

This plugin ships one Agent Skills package under `skills/setup-agent-guidance/`. The repository-root Claude Code and Codex marketplace manifests both point at this plugin; see the root [README](../../README.md). Target-project templates live under the skill's `assets/`.

## Install

### Install via the plugin marketplace (Claude Code)

```text
/plugin marketplace add icho648/skills
/plugin install setup-agent-guidance@icho648-skills
```

Restart Claude Code after installation so the new skill is discovered.

### Install via the marketplace (Codex)

```bash
codex plugin marketplace add icho648/skills
codex plugin add setup-agent-guidance@icho648-skills
```

Start a new Codex task after installation so the plugin skill is discovered.

### Manual installation

Clone the repository, then copy or symlink the skill package to an Agent Skills location supported by your client.

Codex, global:

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.agents/skills/"
```

Claude Code, global:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.claude/skills/"
```

Then invoke `setup-agent-guidance` explicitly or ask the agent to initialize project agent guidance.

To publish a packaged `.skill` archive, trigger `.github/workflows/release.yml` from the Actions tab (workflow_dispatch) or push a `v*` tag; do not commit prebuilt archives into the repository.

## Portable Agent Skills format

The package follows the [Agent Skills specification](https://agentskills.io/specification):

- Each skill is a directory whose name matches the required `name` field.
- `SKILL.md` is required and begins with YAML frontmatter containing at least `name` and `description`.
- Names use lowercase letters, digits, and hyphens and are at most 64 characters.
- `description` states both capability and trigger conditions and is at most 1024 characters.
- `scripts/`, `references/`, and `assets/` are optional; this project intentionally uses only references and assets.
- Resource links are relative to the skill root and loaded progressively.

`agents/openai.yaml` is optional Codex presentation metadata. `.codex-plugin/plugin.json` packages the same portable skill for Codex without adding an MCP server, hook, app, or runtime.

## English and Chinese maintenance policy

This repository uses one skill identity and one canonical workflow in `SKILL.md`. Localized user-facing resources use filename suffixes:

- English: `*.en.md` and `*.en.template.md`
- Simplified Chinese: `*.zh-CN.md` and `*.zh-CN.template.md`

At runtime, the skill chooses a locale from existing project guidance, an explicit user request, or the language of the current request, then reads only that locale. This avoids duplicate trigger descriptions and keeps unused translations out of context.

When changing behavior:

1. Change `SKILL.md` once.
2. Update both localized members of every affected asset/reference pair in the same commit.
3. Preserve headings, managed markers, placeholders, and requirements across both languages.
4. Treat English and Chinese as semantically equal; translation wording may be natural rather than line-for-line.
5. Run validation and review the localized diff before committing.

This “one behavior, localized resources” model is preferable to publishing two separate skills because two independently discoverable descriptions can compete for the same request and drift over time.

## Validate

Using the reference validator from the Agent Skills project, run from the repository root:

```bash
python -m skills_ref.cli validate plugins/setup-agent-guidance/skills/setup-agent-guidance
```

For Codex development environments that include the built-in `skill-creator`, its `quick_validate.py` can also validate the directory.

This repository also ships a GitHub Actions workflow at `.github/workflows/validate.yml` that runs the same check on every push and pull request, so PRs that break the skill will fail CI automatically.

A second workflow at `.github/workflows/release.yml` packages the skill as a `.skill` archive on `workflow_dispatch` (manual button) or on every `v*` tag push, and attaches the archive to the matching GitHub Release. Use the manual run to produce a pre-release artifact without tagging; use the tag flow for a permanent versioned release.

Before release, test at least one English and one Chinese prompt in fresh sessions. Validate two things independently: whether the skill triggers when expected and whether the generated files match the intended behavior.

Chinese trigger conditions live in `skills/setup-agent-guidance/references/triggers.zh-CN.md` and are loaded only when the project or the user request uses Chinese. The English `description` in `SKILL.md` references that file so the frontmatter stays single-language.

## Sources

- [Agent Skills specification](https://agentskills.io/specification)
- [Codex customization and skills](https://developers.openai.com/codex/concepts/customization#skills)
- [OpenAI Codex ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans)
- [Claude Code skills](https://code.claude.com/docs/en/skills)

The ExecPlan templates are adapted from the OpenAI Cookbook article and retained under the MIT terms described in `LICENSE`.

## License

MIT. See [LICENSE](./LICENSE).
