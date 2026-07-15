---
title: Performance
description: The measured before/after — fonts, CSS, deferred JS, WebP/AVIF thumbnails — and the budget harness that keeps it honest.
---

Performance work was its own milestone (Milestone 6), run *after* the port reached
parity, when the port-fidelity constraint could be cut loose. Its posture is stated in the
engine's [`docs/ROADMAP.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ROADMAP.md):
**measure, don't block** — budgets warn, they never fail CI. Every number below is quoted
from the committed task log
([`docs/DEEPSEEK-TASKS-perf.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/DEEPSEEK-TASKS-perf.md))
or the roadmap's scoreboard; the per-phase results blocks were generated from
`dist/perf-budget.json` and the cost ledger, not hand-tallied.

## The scoreboard

| Metric | Before | After |
|---|---|---|
| Font bytes shipped | 906.5 KB (5 formats × weights) | **47.3 KB** (Inter variable woff2) |
| CSS bytes (main + icons) | 93.5 KB unminified | **84.4 KB** minified, icons non-blocking |
| Linked JS (jQuery + A17) | 219.7 KB render-blocking | 219.7 KB **deferred** |
| Gallery thumbnails | PNG/JPEG only | **WebP/AVIF** retina (−64…−93% per preview) |
| Head/SEO | title only | OG + Twitter + canonical, absolute URLs |
| Largest per-page HTML | 13.4 KB | 13.5 KB (within a 20 KB budget) |

## How it was done: measure first

**Phase A built the measurement gate before any optimization**: a perf-budget harness
(`scripts/perf-budget.mjs`) that walks the built `dist/` and writes a report, a test that
asserts the report's shape with **warn-only** budget rows, and the
[model/token ledger](/subfolio-astro-docs/docs/journey/deepseek-workflow/) for
accountability. The fan-out runner refused to start until the harness existed on `main` —
no baseline, no deltas, no work.

Then the phases, each closing with a results block:

- **Phase B — asset quick wins.** The five-format Suisse font stack became a single
  self-hosted **Inter variable woff2 latin subset** (906.5 → 47.3 KB), CSS minified,
  gallery images lazy-loaded (detail-page images deliberately kept eager — they're the
  above-the-fold subject), and the JS-polyfill CSS loader replaced with a native async
  `<link media="print" onload>` pattern.
- **Phase C — modern image formats.** Every generated gallery thumbnail gains `.webp`
  (q80) and `.avif` (q55) siblings from the same retina-doubled `sharp` resize, served via
  `<picture>` with the original format as fallback. Measured per preview:
  `example.png` 120.4 KB → **8.0 KB AVIF (−93%)**, `example.jpg` −64%, `example.gif` −75%.
  A hard scope rule: formats apply **only to derived previews** — originals a visitor
  views or downloads stay byte-identical PNG/JPEG/GIF, verified by a magic-byte test.
- **Phase D — jQuery defer.** Honestly recorded as a *parse-timing* win, not a bytes win:
  the results block notes the 225 KB bundle was already an external cached request at
  baseline, so the delta is that `defer` stops it blocking HTML parsing. The task log says
  so in as many words — "the real delta is parse-timing, not bytes."
- **Phase E — head & SEO.** Covered on the [SEO page](/subfolio-astro-docs/docs/journey/seo/).

## The budgets, ongoing

The harness stays in the suite, asserting against every build: css-total **84.4/96 KB**,
fonts **47.3/620 KB**, largest HTML page **13.5/20 KB**, linked JS **219.7/240 KB** — all
green, all warn-only by design.

## What was deliberately left out

Quoting the roadmap: a jQuery vanilla rewrite, live View Transitions (the flag is wired,
off), and **Lighthouse scoring**. No browser-audit score was ever measured for this
project, so none is quoted anywhere on this site — the byte-level table above is the
evidence that exists.
