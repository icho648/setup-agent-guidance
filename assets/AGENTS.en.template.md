# Agent Guidance Template

This file contains two independent regions. `core` is the generic block that may be installed and upgraded automatically. `project-template` is the shape used to generate project-specific guidance interactively; never copy its placeholders verbatim into a target repository.

<!-- agent-guidance:core:version=1.0.0:start -->
## Agent Engineering Workflow

### Workflow Gearbox

The workflow gearbox is a task-classification rule, not an extra tool. At the start of an engineering task, choose the lowest gear that is sufficient to complete it safely. Do not add ceremony to simple tasks. Shift up when scope, uncertainty, duration, or coordination needs grow.

- **G1 Direct execution**: The task is local, clear, and low risk. Make the change and run relevant verification.
- **G2 Plan first**: The task is complex, ambiguous, or spans several related parts. Explore and clarify first, then produce a reviewable plan. If the current agent supports a Plan mode, use it according to that product or suggest that the user enable it.
- **G3 ExecPlan**: The task may take hours, cross modules or sessions, require pause-and-resume continuity, or contain significant technical unknowns. Before implementation, read the repository-root `PLANS.md` completely and create and maintain a task-specific ExecPlan. Follow the project's existing path convention; otherwise use `plans/<task-slug>.md`.
- **G4 Specification governance**: The requirement needs a durable product specification, multiple approvals, an audit trail, or cross-team coordination. Use the SDD, OpenSpec, Spec Kit, or equivalent process already adopted by the project. Do not install a new governance system without user approval.

If the current gear becomes insufficient during execution, pause implementation and shift up. If the task becomes smaller, later ceremony may be reduced, but do not discard decisions, verification evidence, or recovery information already recorded.

### Verify before claiming completion

Before claiming that a fix, implementation, test, or task is complete, run fresh verification directly relevant to that claim and report the actual commands and results. Do not substitute guesses, stale output, or “should work” for evidence.

### Debug root causes first

For defects, test failures, or unexpected behavior, first reproduce the problem reliably and locate the root cause, then change the implementation. Do not stack patches without validating the hypothesis behind each one.
<!-- agent-guidance:core:version=1.0.0:end -->

<!-- agent-guidance:project-template:start -->
## Project Guidance

### Project structure

- `<key directory or module>`: `<responsibility>`

### Common commands

- Start: `<verified command>`
- Build: `<verified command>`
- Test: `<verified command>`
- Lint: `<verified command>`
- Format: `<verified command>`
- Type check: `<verified command>`

Keep only commands that actually exist in the project. Do not invent entries for missing tools.

### Engineering conventions and constraints

- `<convention found in the repository and confirmed by the user>`

### Definition of done

- `<verification requirements proportionate to project risk>`

### Code review

For code review or the final pre-completion review, read and follow the repository-root `code_review.md` completely.
<!-- agent-guidance:project-template:end -->
