# icho648-skills

[![validate skills](https://github.com/icho648/skills/actions/workflows/validate.yml/badge.svg)](./.github/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-1.0-blue)](https://agentskills.io/specification)

[简体中文](README.zh-CN.md)

A searchable Claude Code **plugin marketplace** hosting portable Agent Skills by `icho648`. Add this repository as a marketplace, then install any skill as a plugin.

## Plugins

| Plugin | Skill | What it does |
| --- | --- | --- |
| [setup-agent-guidance](plugins/setup-agent-guidance/) | `setup-agent-guidance` | Initialize or refresh durable project agent guidance: detect `AGENTS.md`/`CLAUDE.md`, install a progressive workflow and `PLANS.md`, then scan the repository to draft project-specific rules and `code_review.md` with explicit user confirmation. |
| [grounded-explainer](plugins/grounded-explainer/) | `grounded-explainer` | Explain an object's unique core and necessary implementation from a concrete scenario and the existing problem it solves. Triggered only by explicit invocation (`$grounded-explainer` or `/grounded-explainer:grounded-explainer`). |

## Install

### Add the marketplace and install a plugin (Claude Code)

```text
/plugin marketplace add icho648/skills
/plugin install setup-agent-guidance@icho648-skills
/plugin install grounded-explainer@icho648-skills
```

Or from the CLI:

```bash
claude plugin marketplace add icho648/skills
claude plugin install setup-agent-guidance@icho648-skills
```

Restart Claude Code after installing so the new skills are discovered.

### Manual installation

Each plugin's skill is a portable Agent Skills package under `plugins/<name>/skills/<name>/`. Clone the repository, then copy or symlink a skill directory to a location your client scans.

Claude Code, global:

```bash
mkdir -p "$HOME/.claude/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.claude/skills/"
cp -R plugins/grounded-explainer/skills/grounded-explainer "$HOME/.claude/skills/"
```

Codex, global:

```bash
mkdir -p "$HOME/.agents/skills"
cp -R plugins/setup-agent-guidance/skills/setup-agent-guidance "$HOME/.agents/skills/"
cp -R plugins/grounded-explainer/skills/grounded-explainer "$HOME/.agents/skills/"
```

Then invoke the skill explicitly (`$setup-agent-guidance` or `$grounded-explainer`).

## Repository layout

```text
.
├── .claude-plugin/
│   └── marketplace.json          # Claude Code marketplace registry
├── plugins/
│   ├── setup-agent-guidance/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/setup-agent-guidance/   # Agent Skills package
│   │   │   ├── SKILL.md
│   │   │   ├── agents/openai.yaml          # optional Codex UI metadata
│   │   │   ├── assets/                     # localized templates
│   │   │   └── references/                 # localized onboarding procedure
│   │   ├── README.md
│   │   └── README.zh-CN.md
│   └── grounded-explainer/
│       ├── .claude-plugin/plugin.json
│       └── skills/grounded-explainer/
│           ├── SKILL.md
│           └── agents/openai.yaml
├── .github/workflows/            # validate.yml and release.yml
├── AGENTS.md                     # maintenance instructions for coding agents
├── CLAUDE.md                     # imports the same maintenance instructions
├── README.md
├── README.zh-CN.md
└── LICENSE
```

The repository root is the **marketplace**. Each `plugins/<name>/` directory is one Claude Code plugin and contains exactly one Agent Skills package under `skills/<name>/`.

## Two compatible standards

- **Claude Code plugin marketplace.** `.claude-plugin/marketplace.json` registers the marketplace and lists each plugin with a local `source` path. Each plugin has a `.claude-plugin/plugin.json` manifest. This is what makes the skills searchable and installable via `/plugin`.
- **Agent Skills specification.** Each `skills/<name>/` directory is a standalone, cross-client Agent Skills package (`SKILL.md` + optional `assets/`, `references/`, `agents/`), validated with `skills-ref`. Codex and other Agent Skills clients can consume it directly without the plugin wrapper.

`agents/openai.yaml` is optional Codex presentation metadata; other Agent Skills clients ignore it.

## English and Chinese maintenance policy

Each skill keeps one identity and one canonical workflow in its `SKILL.md`. Localized user-facing resources use filename suffixes:

- English: `*.en.md` and `*.en.template.md`
- Simplified Chinese: `*.zh-CN.md` and `*.zh-CN.template.md`

`setup-agent-guidance` ships localized asset/reference pairs. `grounded-explainer` is authored in Simplified Chinese. When changing behavior, update both localized members of every affected pair in the same change and keep headings, managed markers, placeholders, and requirements in semantic lockstep.

## Validate

Using the reference validator from the Agent Skills project:

```bash
python -m skills_ref.cli validate plugins/setup-agent-guidance/skills/setup-agent-guidance
python -m skills_ref.cli validate plugins/grounded-explainer/skills/grounded-explainer
```

This repository also ships a GitHub Actions workflow at `.github/workflows/validate.yml` that validates every skill and the marketplace manifest on every push and pull request, so PRs that break a skill or the marketplace will fail CI automatically.

A second workflow at `.github/workflows/release.yml` builds a `.skill` archive per skill on `workflow_dispatch` or on every `v*` tag push, and attaches the archives to the matching GitHub Release. Use the manual run to produce a pre-release artifact without tagging; use the tag flow for a permanent versioned release.

## Sources

- [Claude Code plugins and marketplaces](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent Skills specification](https://agentskills.io/specification)
- [Codex customization and skills](https://developers.openai.com/codex/concepts/customization#skills)
- [Claude Code skills](https://code.claude.com/docs/en/skills)

## License

MIT. See [LICENSE](LICENSE).
