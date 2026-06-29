# Changelog

All notable changes to this skill are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-30

### Added
- Initial release of the `setup-agent-guidance` skill.
- Detects existing `AGENTS.md`, `CLAUDE.md`, and `.claude/CLAUDE.md` and refreshes them in place.
- Installs a four-gear progressive workflow (direct / plan first / ExecPlan / existing governance).
- Installs `PLANS.md` from localized templates when absent, preserving existing user-owned versions.
- Read-only repository scan with explicit user confirmation before generating project-specific guidance.
- Generates `code_review.md` only after explicit confirmation; existing files are treated as user-owned policy.
- English (`*.en.*`) and Simplified Chinese (`*.zh-CN.*`) resource pairs.
- `agents/openai.yaml` providing optional Codex UI metadata.
- GitHub Actions workflow that runs `skills-ref validate` on push and pull requests.