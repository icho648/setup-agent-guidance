---
name: setup-agent-guidance
description: >-
  Initialize or refresh durable project agent guidance by detecting AGENTS.md and
  CLAUDE.md, installing a progressive workflow and localized PLANS.md, then scanning
  the repository and asking the user before generating project-specific rules and
  code_review.md. Use when the user asks to initialize, bootstrap, generate,
  customize, or refresh project agent instructions, AGENTS.md, CLAUDE.md,
  execution-plan guidance, testing standards, or code-review policy. Do not use for
  ordinary feature implementation after guidance is already current. Localized
  triggers: references/triggers.zh-CN.md.
license: MIT
metadata:
  version: "1.0.0"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Set Up Project Agent Guidance

Complete setup in two phases: first install generic rules that require no project-specific judgment, then use a read-only scan and user confirmation to generate project-specific guidance. Use the agent's own file tools; do not depend on bundled scripts or an additional runtime.

## Select the working language

Choose one locale before reading templates:

1. If an existing target instruction file clearly uses Chinese, select `zh-CN`.
2. If it clearly uses English, select `en`.
3. Otherwise, follow the language of the user's current request.
4. If the user explicitly requests a language, that choice wins.

Read only files for the selected locale. Do not mix languages inside a generated managed block unless the user asks.

## Locate the project and instruction files

1. Determine the project root. Prefer the current Git repository root; without Git, use the user-specified directory or current working directory.
2. Select target instruction files:
   - Select root `AGENTS.md` when present.
   - Select root `CLAUDE.md` when present; otherwise select `.claude/CLAUDE.md` when present.
   - When both Codex and Claude instruction files exist, update both.
   - When neither exists, create only root `AGENTS.md`.
3. Do not create a second entry file for the same agent ecosystem.

## Phase one: install the generic core

Read the selected `assets/AGENTS.<locale>.template.md` and every target instruction file completely, then install the template's `agent-guidance:core` block.

- When both Core markers occur exactly once, update only the content between them; skip when it already matches.
- When neither Core marker exists, append the Core block at the end of the file.
- When markers are missing, reversed, or duplicated, stop modifying that file and report the problem. Do not guess a repair.
- Preserve all content outside the managed block and preserve the predominant newline style.
- If a legacy `workflow-gearbox:start/end` block exists and both markers are complete and unique, remove it before installing the new Core. If the old markers are malformed, stop and report.

Then inspect repository-root `PLANS.md`:

- When it exists, preserve it completely; do not compare, merge, or overwrite it.
- When it does not exist, install `assets/PLANS.<locale>.md` verbatim as root `PLANS.md`. Do not rewrite, summarize, or translate it again.
- Do not create an empty task ExecPlan. Create one only when an agent selects G3 for an actual task.

After phase one, reread the results. Confirm that every target contains exactly one pair of Core markers, outside content remains present, and `PLANS.md` was preserved or installed correctly.

## Phase two: interactive project onboarding

Read `references/project-onboarding.<locale>.md`, the project block in `assets/AGENTS.<locale>.template.md`, and `assets/CODE_REVIEW.<locale>.template.md` completely. Follow the onboarding workflow for a read-only repository scan.

1. Derive a candidate project profile, verification commands, and review standards from repository evidence. Do not ask the user questions that the repository can answer.
2. Show concise findings and ask only high-impact preferences that cannot be determined from the repository. Prefer a structured question tool when available; otherwise ask short direct questions.
3. From the answers, draft:
   - an `agent-guidance:project` block for each target instruction file;
   - repository-root `code_review.md`.
4. Show the proposed content or diff and obtain explicit user confirmation before writing.
5. If the user defers onboarding, stop phase two, preserve phase-one changes, and do not create a generic `code_review.md`.

Treat an existing `agent-guidance:project` block or `code_review.md` as user-owned project policy: propose diffs and never overwrite without confirmation. After generating `code_review.md`, the project block must require agents to read it completely for code review and pre-completion review.

## Validate and report

Confirm:

- The correct target instruction files were selected and no redundant entry was created.
- Core markers are complete and unique.
- Project markers, when present, are complete and unique.
- Existing user content was not lost.
- `PLANS.md` and an existing `code_review.md` were not silently overwritten.
- Commands in the project block are supported by repository evidence.
- A repeated run proposes only necessary differences and never appends duplicate blocks.

Report which files were created, updated, preserved, or skipped, plus any decisions still requiring a human.

## Customize this skill

- Edit both `assets/AGENTS.en.template.md` and `assets/AGENTS.zh-CN.template.md` when changing generic Core behavior or the project-block shape.
- Edit both `assets/PLANS.en.md` and `assets/PLANS.zh-CN.md` when changing ExecPlan guidance.
- Edit both `assets/CODE_REVIEW.en.template.md` and `assets/CODE_REVIEW.zh-CN.template.md` when changing the review-document scaffold.
- Edit both onboarding references when changing repository scanning, questions, or confirmation flow.
- Keep every English/Chinese pair structurally and semantically equivalent; update both in the same change.

Do not use repository-root `AGENTS.md` as a target-project template; it governs development of this skill repository. Target-project templates belong under `assets/`.

## Safety boundaries

- Do not automatically install third-party skills, plugins, OpenSpec, or another governance system; recommend them only when justified by project needs.
- Do not perform destructive operations, create commits, or change model, permission, or sandbox configuration.
- During scanning, skip credentials, secrets, dependency caches, build output, and large generated files.
- Do not make TDD, a coverage threshold, automatic commits, or a specific branch policy the default unless the repository already requires it or the user confirms it.
