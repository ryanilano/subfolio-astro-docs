---
title: The DeepSeek Workflow
description: How the port was actually built — a DeepClaude proxy, an Opus-built Gate, DeepSeek fan-out waves in parallel worktrees, and provable costs.
---

The port wasn't just *to* a new stack — it was *built* with an unusual workflow: Claude
Code pointed at a local **DeepClaude proxy** that routes requests to **DeepSeek**, with
the expensive frontier model reserved for the work that actually needs it. The engine
repo states the setup in its first line of agent guidance
([`CLAUDE.md`](https://github.com/ryanilano/subfolio-astro/blob/main/CLAUDE.md)):

> **Backend:** developed via the DeepClaude proxy (`ANTHROPIC_BASE_URL=http://127.0.0.1:3200`)
> → **DeepSeek**. Run `/anthropic` for Anthropic passthrough.

## The division of labor: Gate and Wave

The pattern predates the Astro port — it was first used for the abandoned Go port and
carried over "same shape, new unit of work"
([`docs/DEEPSEEK-TASKS.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/DEEPSEEK-TASKS.md)).
Its premise is stated plainly in the task brief:

> DeepSeek is strong at mechanical PHP→Astro translation and reading existing code; weaker
> at architecture. That is exactly why the Gate is built in Opus first, not offloaded.

So each milestone splits in two:

- **The Gate** — built in Opus (Claude), never offloaded. The architectural contract every
  worker depends on: the layout, the component prop contract, and one reference component
  ported end-to-end as the pattern to mirror. The fan-out runner literally refuses to
  start (`--guard`) until the Gate artifacts exist on `main`.
- **The Wave** — a set of *conflict-free, per-file* tasks fanned out to DeepSeek in
  parallel. Each task brief is the complete prompt: what to read, what to produce, the
  "done when" bar. Every task writes its own new file, so branches merge cleanly in any
  order. For Phase 2 that meant one Astro component per PHP theme view (`vid.php` →
  `Vid.astro`, and so on).

Mechanically, a shell runner
([`docs/run-deepseek-perf.sh`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/run-deepseek-perf.sh))
flips the proxy to DeepSeek and launches each task as a headless `claude -p` worker in
its **own git worktree**, up to four in parallel, teeing each worker's result JSON to
disk for the ledger.

## The lessons (committed as agent guidance)

The recurring DeepSeek failure mode was "Astro treated as PHP" — and it's documented so
every future worker inherits the scar tissue
([`AGENTS.md`](https://github.com/ryanilano/subfolio-astro/blob/main/AGENTS.md)):

- **Astro `<style>`/`<script>` blocks are not interpolated.** `{palette.back}` inside
  `<style>` fails the build; `{site_root}` inside a raw-text `<script>` is emitted
  literally. The fix: build the string in frontmatter and emit with `set:html`.
- **A green `astro build` does not prove a component renders.** The build only compiles
  routes that are reached — a component no route instantiates keeps its render bugs
  invisible. The Phase 2 Gate's own `Layout.astro` shipped four render bugs this way.
- The standing rule that follows: **DeepSeek output needs a render check, not just a
  build check.** Review by rendering a real page and grepping the output for leftover
  `{...}`, not by trusting a green build.

## The cost, provably

Milestone 6 added an accountability requirement: a **model/token ledger** for every
fan-out ([`scripts/ledger.mjs`](https://github.com/ryanilano/subfolio-astro/blob/main/scripts/ledger.mjs),
output committed as
[`docs/ledger-perf.json`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ledger-perf.json)).

It exists because of a trap worth knowing about: the local `claude -p` envelope **always
reports an Anthropic model at Anthropic pricing**, regardless of which backend the
DeepClaude proxy actually routed to (see
[aattaran/deepclaude#39](https://github.com/aattaran/deepclaude/issues/39)). The real
backend and pricing are only known to the proxy, so the runner snapshots the proxy's
`/_proxy/cost` endpoint before and after each fan-out and the ledger diffs them.

The Phase C fan-out (WebP/AVIF thumbnail work, 2 tasks, 17 requests), from the committed
ledger:

| | Reported by the local envelope | Proxy truth |
|---|---|---|
| Backend | "claude-opus-4-8" | **DeepSeek** |
| Cost | $1.556 | **$0.0829 actual** ($0.6984 Anthropic-equivalent) |
| Tokens | 159,390 in / 14,686 out | same |

In other words: the fanned-out work cost about **an eighth** of its Anthropic-equivalent
price ($0.0829 vs $0.6984, a saving of $0.6155 on this phase alone) — and the phases that
stayed Opus-owned in-session (D and E) are recorded in the same results log at **$0** of
fan-out cost. Small absolute numbers, but the point of the ledger is that the split is
*provable* per phase, not vibes.

## What this workflow bought

- **Frontier-model judgment where it matters** — architecture, contracts, render review —
  and cheap mechanical throughput where it doesn't.
- **Parallelism without merge pain**, because task design (disjoint files) did the
  isolation, not tooling luck.
- **A paper trail**: task briefs, per-phase results with numbers, and a committed ledger.
  This documentation section exists because that trail does.
