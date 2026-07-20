# prd-workflow

A Claude Code and Codex plugin that keeps PRD authoring, implementation, and review in one installable dependency boundary.

## Included skills

- `write-prd`
- `implement-prd`
- `review-prd-implementation`

`review-prd-implementation` is a hard dependency of `implement-prd`, so these skills intentionally ship together.

## Install

```bash
codex plugin marketplace add icho648/flowcrafter
codex plugin add prd-workflow@flowcrafter
```

For Claude Code:

```bash
claude plugin marketplace add icho648/flowcrafter
claude plugin install prd-workflow@flowcrafter
```

Codex invokes the skills as `$write-prd`, `$implement-prd`, and `$review-prd-implementation`. Claude Code uses `/prd-workflow:<skill-name>`.

## License

MIT. See [LICENSE](LICENSE).
