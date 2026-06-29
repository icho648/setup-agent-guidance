# Code Review and Testing Standards

This file is the scaffold for a project-level `code_review.md`. Replace placeholders with repository evidence and user-confirmed decisions, and remove all generation notes. Do not install this template unchanged as a generic policy.

## Review goals and priority

Look for issues that can materially affect users, production systems, or maintenance cost, in this order unless the project calls for a different priority:

1. Correctness and requirement fit.
2. Security, privacy, and data integrity.
3. Regression risk and compatibility.
4. Reliability, concurrency, resources, and error handling.
5. Performance and operability.
6. Maintainability; report style issues only when they create real risk.

Project-specific focus: `<risk areas confirmed by the user>`.

## Context to read before review

- The current requirement, task description, or ExecPlan.
- The complete diff and affected callers, data flows, and configuration.
- Related tests, CI, migrations, public interfaces, and runbooks.
- `<project-specific required files>`.

## Required checks

### Behavior and correctness

- The change implements the requested behavior without omitting important branches or boundary cases.
- Error paths, null values, timeouts, retries, and partial failures are handled reasonably.
- New behavior remains consistent with existing callers and public contracts.

### Tests and verification

- New or updated tests cover meaningful success and failure paths.
- Tests would expose the bug before the change or clearly prove the newly requested behavior.
- Passing results are not manufactured by weakening assertions, skipping tests, or excessive mocking.
- Completion claims include fresh, reproducible verification evidence.

### Security and data

- Input validation, authorization, sensitive information, injection risk, and dependency boundaries are checked.
- Database, persisted-format, or migration changes have compatibility, rollback, and failure-recovery plans.

### Compatibility and operations

- `<supported platform, version, and public-interface compatibility requirements>`.
- Logs, metrics, and errors are sufficient to diagnose new failure modes without leaking sensitive information.

### Maintainability

- The implementation uses the minimum necessary complexity and adds no abstraction or dependency without a current use.
- Names, boundaries, and comments explain non-obvious decisions rather than restating the code.

## Project quality gates

Include only commands that actually exist in the repository and have been confirmed by the user.

| Gate | Command | Blocking | Expected result |
| --- | --- | --- | --- |
| Tests | `<command>` | `<yes/no>` | `<result>` |
| Lint | `<command>` | `<yes/no>` | `<result>` |
| Format | `<command>` | `<yes/no>` | `<result>` |
| Type check | `<command>` | `<yes/no>` | `<result>` |
| Build or end-to-end verification | `<command>` | `<yes/no>` | `<result>` |

## Finding severity

- **Blocking**: Could cause a security incident, data corruption, major functional failure, or unsafe release.
- **Important**: A concrete defect, regression, or high-probability maintenance risk that should be fixed before merge.
- **Suggestion**: A low-risk improvement with specific benefit; do not disguise it as a blocker.

Each finding should identify a precise location, trigger condition, real impact, and minimal repair direction. When there are no actionable findings, say so and list remaining unverified risks.

## Definition of done

- Every blocking and important finding is resolved or explicitly accepted by the user.
- Every blocking gate passes, with commands and results reported.
- Actual behavior matches the requirement, project guidance, and compatibility constraints.
- `<project-specific completion condition>`.
