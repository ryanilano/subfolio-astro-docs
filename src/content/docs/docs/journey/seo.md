---
title: SEO
description: From a bare <title> to canonical + Open Graph + Twitter Cards on every page — asserted by tests that gate the deploy.
---

The PHP original shipped pages with a `<title>` and nothing else. Milestone 6's Phase E
gave every page a full head-meta contract — and, more unusually, a **test suite that
gates the deploy on it**, so the contract can't silently rot.

## What every page now carries

From the contract encoded in the engine's
[`tests/seo.test.mjs`](https://github.com/ryanilano/subfolio-astro/blob/main/tests/seo.test.mjs):

- A **canonical link** and `og:url` with **absolute URLs**, resolved against the
  configured site origin.
- **Open Graph + Twitter Card** tags on every page: folder/listing routes are
  `og:type=website`, file detail routes are `og:type=article`.
- Gallery folders expose an **`og:image`** pointing at their first thumbnail — in a
  **crawler-safe base format** (never the `.webp`/`.avif` sibling, which some scrapers
  won't render), and upgrade the Twitter card to `summary_large_image`.
- Pages with no image **omit** `og:image` entirely and stay `twitter:card=summary` —
  no placeholder junk for crawlers.

A sitemap is generated at build time (wired in Phase 3 alongside the deploy), and the
site URL is env-overridable with a `noindex` flag for non-canonical deployments — the
archive mirror can be deployed without competing with the canonical domain in search.

## Tests that can't drift from config

An earlier version of the SEO test hardcoded the site name — and broke *silently* when
the project was renamed after Phase E. The rewritten suite reads its expectations **from
the same sources the build reads**: the site URL is parsed out of `astro.config.mjs`
(honoring the same env override), the site name out of `config/settings.yml`. A rebrand
or domain move now updates the test's expectations automatically; the test file says
this is exactly why
([`tests/seo.test.mjs`](https://github.com/ryanilano/subfolio-astro/blob/main/tests/seo.test.mjs)).

## Gating the deploy

The GitHub Actions workflow
([`.github/workflows/deploy.yml`](https://github.com/ryanilano/subfolio-astro/blob/main/.github/workflows/deploy.yml))
runs the structural smoke suite, the SEO head assertions, **and** an accessibility pass
(axe-core WCAG 2.0/2.1 A+AA plus a palette contrast check) against the exact `dist/` it
just built, before wrangler is allowed to publish. The workflow's own comment explains
why: a green `astro build` does not prove a render — the tests encode the render anchors,
so nothing red can ship.
