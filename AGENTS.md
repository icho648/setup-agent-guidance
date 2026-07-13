# Repository Agent Guidance

This repository is a Claude Code **plugin marketplace** that hosts one or more skill plugins. The repository root is the marketplace; each `plugins/<name>/` directory is one plugin and contains exactly one Agent Skills package under `skills/<name>/`. Repository-root maintenance files are shipped alongside the marketplace.

## Source of truth

- `.claude-plugin/marketplace.json` is the marketplace registry: it lists every plugin and its local `source` path.
- Each plugin's `.claude-plugin/plugin.json` is that plugin's manifest (name, version, description, author).
- Each `skills/<name>/SKILL.md` is the single canonical workflow for that skill.
- Treat English and Simplified Chinese resources as semantically equal pairs within the skill that ships them.
- Do not create separately discoverable language-specific skills or plugins.
- Keep target-project templates under the owning skill's `assets/`; this root `AGENTS.md` governs repository maintenance only.

## Change rules

- Update both locale variants in the same change whenever behavior, headings, markers, placeholders, or requirements change (applies to `setup-agent-guidance` asset/reference pairs).
- Preserve the managed markers exactly: `agent-guidance:core` and `agent-guidance:project-template`.
- Keep each `SKILL.md` concise and route detailed procedures to its `references/` and static templates to its `assets/`.
- Keep skills runtime-free unless a future requirement demonstrably cannot be implemented with agent-native file operations.
- Do not introduce platform-specific frontmatter into a `SKILL.md`; optional client metadata belongs in its client-specific directory (e.g. `agents/openai.yaml`).
- Preserve the English ExecPlan source and the Chinese translation in semantic lockstep.
- When adding, renaming, or removing a plugin, update `marketplace.json` and the plugin's `plugin.json` in the same change, and keep the plugin directory name, the `source` path, the `plugin.json` name, and the skill directory name consistent.
- Keep `marketplace.json` descriptions in sync with each plugin's `plugin.json` description.

## Verification

Before claiming a change complete:

1. Validate every skill package with an Agent Skills-compatible validator (`skills_ref` against each `plugins/<name>/skills/<name>/`).
2. Confirm `.claude-plugin/marketplace.json` is valid JSON and every `source` path resolves to a directory containing `.claude-plugin/plugin.json`.
3. Check that every localized resource has its counterpart.
4. Compare paired headings, managed markers, placeholders, and file references.
5. Verify every relative path referenced by each `SKILL.md` exists within its own skill directory.
6. For behavioral changes, test an English and a Chinese prompt in fresh sessions when the client is available.
7. Update both root READMEs when installation, structure, compatibility, or maintenance policy changes; update a plugin's README when that plugin changes.

Do not create releases, push branches, or publish to a marketplace without explicit user authorization.
