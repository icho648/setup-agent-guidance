# prd-workflow

一个把 PRD 编写、实施和审阅保持在同一安装依赖边界内的 Claude Code 与 Codex 插件。

## 包含的 Skills

- `write-prd`
- `implement-prd`
- `review-prd-implementation`

`review-prd-implementation` 是 `implement-prd` 的硬依赖，因此三者有意随同一个插件安装。

## 安装

```bash
codex plugin marketplace add icho648/flowcrafter
codex plugin add prd-workflow@flowcrafter
```

Claude Code：

```bash
claude plugin marketplace add icho648/flowcrafter
claude plugin install prd-workflow@flowcrafter
```

Codex 中分别使用 `$write-prd`、`$implement-prd` 和 `$review-prd-implementation`；Claude Code 使用 `/prd-workflow:<skill-name>`。

## 许可

MIT。见 [LICENSE](LICENSE)。
