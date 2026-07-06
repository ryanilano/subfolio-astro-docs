---
title: Changes & Improvements
description: What changed in the port from PHP/Kohana to Astro — sourced comparisons, not recollections.
---

Subfolio-astro is a **port**, not a rewrite from scratch: the same `directory/` content
conventions carry over unchanged, while the engine underneath moves from a PHP/Kohana
runtime to a build-time Astro static site. Every claim below is either sourced to a
primary reference or quoted verbatim from an already-committed, already-measured
engine document — nothing here is a recalled figure.

## Why move off PHP/Kohana

The original Subfolio ran on **Kohana 2.x / PHP 5.6** — both long past end of life:

- **PHP 5.6** reached end of life on **31 Dec 2018** ([php.net/eol.php](https://www.php.net/eol.php)).
- **Kohana** was officially retired on **1 Jul 2017** ([kohana/kohana#110](https://github.com/kohana/kohana/issues/110), "Kohana Retirement – 2017/07/01").
- Kohana's last stable release, **3.3.6**, shipped **25 Jul 2016** (verified via the [GitHub Releases API](https://github.com/kohana/kohana/releases/tag/v3.3.6): `published_at: 2016-07-25`).

**Security framing:** PHP 5.6 and Kohana are both past end of life and unpatched. No
CVE-by-CVE audit was performed for this page — the framework/runtime end-of-life dates
above are reason enough on their own.

## Architecture: request-time to build-time

| | Original (PHP / Kohana) | Port (Astro) |
|---|---|---|
| Engine | `Filebrowser.php` / `Subfolio.php` request-time controllers | Build-time content loader (`src/loaders/`) walks the tree once, at build |
| Hosting | PHP runtime — a server is required | Static files, deployed to Cloudflare Pages |
| Content conventions | `directory/` naming conventions (embeds, enhancers, hidden items, `-access`) | Same `directory/` naming conventions — unchanged |
| YAML config | Spyc | `yaml` (npm) |

## Performance (Milestone 6)

The figures below are quoted verbatim from the engine's own Milestone 6 performance
pass, committed in [`docs/ROADMAP.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ROADMAP.md#milestone-6--performance--build-modernization-complete):

| Metric | Before | After | Source |
|---|---|---|---|
| Font bytes shipped | 906.5 KB (5 formats x weights) | **47.3 KB** (Inter variable woff2) | Milestone 6, engine docs/ROADMAP.md |
| CSS bytes (main + icons) | 93.5 KB unminified | **84.4 KB** minified, icons non-blocking | Milestone 6, engine docs/ROADMAP.md |
| Gallery thumbnails | PNG/JPEG only | **WebP/AVIF** retina (−64…−93%/preview) | Milestone 6, engine docs/ROADMAP.md |
| Largest per-page HTML | 13.4 KB | 13.5 KB (within a 20 KB budget) | Milestone 6, engine docs/ROADMAP.md |

No browser-performance-audit score is quoted here — none was measured for this
project (a "measure, don't block" posture: perf figures are tracked, but no such
audit ran in CI).

## Honesty: `-access` is parsed, not enforced

The original PHP app enforced `-access` rules at request time. The Astro port's
content loader **parses** `-access` YAML rules and captures them as typed data on
each folder entry — but access control is **not currently enforced**. Enforcement
is deferred to an optional Cloudflare Worker (auth) that has not been built. Until
that Worker exists, every folder served by this port is public, whether or not it
carries an `-access` file.
