# Repository Agent Guidance

This repository root is one portable Agent Skill package. Repository-root maintenance files are shipped alongside the skill.

## Source of truth

- Keep one workflow implementation in `SKILL.md`.
- Treat English and Simplified Chinese resources as semantically equal pairs.
- Do not create separately discoverable language-specific skills.
- Keep target-project templates under `assets/`; this root `AGENTS.md` governs repository maintenance only.

## Change rules

- Update both locale variants in the same change whenever behavior, headings, markers, placeholders, or requirements change.
- Preserve the managed markers exactly: `agent-guidance:core` and `agent-guidance:project-template`.
- Keep `SKILL.md` concise and route detailed procedures to `references/` and static templates to `assets/`.
- Keep the skill runtime-free unless a future requirement demonstrably cannot be implemented with agent-native file operations.
- Do not introduce platform-specific frontmatter into `SKILL.md`; optional client metadata belongs in its client-specific directory.
- Preserve the English ExecPlan source and the Chinese translation in semantic lockstep.

## Verification

Before claiming a change complete:

1. Validate the repository root with an Agent Skills-compatible validator.
2. Check that every localized resource has its counterpart.
3. Compare paired headings, managed markers, placeholders, and file references.
4. Verify every relative path referenced by `SKILL.md` exists.
5. For behavioral changes, test an English and a Chinese prompt in fresh sessions when the client is available.
6. Update both READMEs when installation, structure, compatibility, or maintenance policy changes.

Do not create releases, push branches, or publish to a marketplace without explicit user authorization.
