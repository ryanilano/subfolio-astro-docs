---
title: Deploying for Free
description: Cloudflare Pages for the engine, GitHub Pages for these docs — versus a PHP host, Apache, and an SFTP script.
---

## What the original required

Running PHP Subfolio meant operating a server: a **PHP 5.6 host with Apache**
(`mod_rewrite` rules doing the routing, `htaccess` blocking direct access to config), a
front controller that set a **2 GB memory limit** for thumbnail generation, and a
front-end deploy done by **Grunt over SFTP** with credentials in a `.ftppass` file. All
of it on a runtime nobody patches anymore.

## What the port costs

The deployment ADR's first listed consequence: **"cost/ops drop to ~zero."**

- **The engine/demo → Cloudflare Pages (free tier).** `npm run deploy` is
  `wrangler pages deploy ./dist`; pushing to `main` auto-deploys via GitHub Actions,
  gated on the smoke, SEO, and accessibility suites
  ([`.github/workflows/deploy.yml`](https://github.com/ryanilano/subfolio-astro/blob/main/.github/workflows/deploy.yml)).
  Live at [subfolio-astro.ilano.fyi](https://subfolio-astro.ilano.fyi) with a
  `.pages.dev` fallback domain. The heavy work the PHP server did per-request —
  thumbnails, RSS, listings — happens once in CI, and the host serves files.
- **This documentation site → GitHub Pages (free).** Built with the official Astro
  action and deployed as a project site — chosen deliberately to mirror how AREA17
  hosts the original Subfolio's docs.
- **If access control ever becomes real**, the deferred auth Worker also fits
  Cloudflare's free Workers tier — the ADR priced that path before choosing it.

The trade that pays for all this is the one named on
[Why the Port](/subfolio-astro-docs/docs/journey/why-the-port/): publishing a new file
means a rebuild — locally via watch, or a push that triggers the Pages deploy. For a
portfolio gallery with mixed authoring cadence, that's a build-minute, not a server bill.

## The same content, either way

Because the port reads an unmodified Subfolio `directory/` tree, "deploying for free"
required no content migration: the same folder that a paid PHP host once served is what
the free static pipeline builds from. The hosting bill was the only thing that didn't
carry over.
