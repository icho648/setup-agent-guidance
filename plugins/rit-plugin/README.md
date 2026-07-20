# rit-plugin

Rit's personal Claude Code and Codex workflow bundle.

## Included skills

- `setup-agent-guidance` — initialize durable, bilingual project guidance.
- `grounded-explainer` — explicitly invoked, problem-first technical explanation.
- `learn` — maintain evidence-based learning state through real practice.

Grouped as one personal workflow set so they install and version together; each skill remains independently usable. The PRD delivery workflow is separately installable as `prd-workflow`.

## Install

```bash
codex plugin marketplace add icho648/flowcrafter
codex plugin add rit-plugin@flowcrafter
```

For Claude Code:

```bash
claude plugin marketplace add icho648/flowcrafter
claude plugin install rit-plugin@flowcrafter
```

Codex invokes the skills as `$setup-agent-guidance`, `$grounded-explainer`, and `$learn`. Claude Code uses `/rit-plugin:<skill-name>`.

## License

MIT. See [LICENSE](LICENSE).
