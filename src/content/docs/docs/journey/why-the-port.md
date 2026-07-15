---
title: Why the Port
description: The EOL PHP/Kohana stack, the security debt it carried, and the Go detour that came before Astro.
---

## A dead stack, twice over

The original Subfolio ran on **Kohana 2.x / PHP 5.6**:

- **PHP 5.6** reached end of life on **31 Dec 2018** ([php.net/eol.php](https://www.php.net/eol.php)).
- **Kohana** was officially retired on **1 Jul 2017**
  ([kohana/kohana#110](https://github.com/kohana/kohana/issues/110)); its last stable
  release, **3.3.6**, shipped **25 Jul 2016**.

The blocker to staying on PHP was *Kohana*, not the language: Kohana 2.x cannot run on
modern PHP 8, so "just upgrade PHP" was never viable
([`plans/MODERNIZATION.md`](https://github.com/ryanilano/subfolio/blob/master/plans/MODERNIZATION.md)).
The core app, though, is small — list a directory, render galleries from file-naming
conventions, serve files, read YAML config — so a rewrite was tractable.

## The security debt

The modernization plan named concrete issues to fix in any rewrite, not just "old = bad"
(all from `plans/MODERNIZATION.md`):

1. **Path traversal / arbitrary file read** — `Filebrowser.php:179` concatenated the raw
   `?path=` query onto the directory root with no sanitization, and the access action then
   `readfile()`'d the result.
2. **Dead runtime + dead framework** — unpatched since their EOL dates above.
3. **Weak auth** — `users.yml` allowed plaintext `password:` entries, and hashed passwords
   used fast MD5 with a single global salt (identical passwords → identical hashes).
4. **A fossilized front-end pipeline** — Grunt on Node 8.

## The Go detour

The first plan (2026-06-27) targeted a **Go single static binary** — the reasoning was to
"escape the runtime-EOL treadmill permanently." That work genuinely started: Phase 0
extracted stack-agnostic behavior specs from the PHP engine, and a Phase 1 Go skeleton
landed with a root-jailed path resolver (fixing the traversal bug, with tests), a config
loader, and a JSON directory server. Library ADRs picked `go-chi/chi` for routing,
`alexedwards/scs` for sessions, and `bcrypt` to replace the MD5 scheme
([`plans/adr/ADR-web-stack.md`](https://github.com/ryanilano/subfolio/blob/master/plans/adr/ADR-web-stack.md)).

## The pivot to Astro

The deployment ADR
([`docs/ADR-deployment.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ADR-deployment.md))
reframed the question. Not "static vs. dynamic" — but *which request-time behaviors
actually need a server?* Walking the PHP engine's behavior inventory: thumbnails, listings,
embeds, RSS, and `.oplx` zips all resolve at **build time**; sort preferences and mobile
detection resolve **client-side**. The only genuinely server-bound pair is **auth +
access-gated file serving** — and those were rated nice-to-have, not required.

With every hard constraint loose, the tiebreakers became **cost** and **stack fluency**:
the maintainer already operated an Astro → Cloudflare static site, so a bespoke Go service
meant paying (in money and learning) for features rated nice-to-have. The decision:

> **Target C — Astro static, hybrid-ready.** Ship pure-static first on Cloudflare Pages,
> with a clean seam where a Cloudflare Worker can later add auth + gated serving *if and
> only if* that need becomes real.

Two consequences worth naming:

- **The path-traversal bug disappears by construction.** A static build has no runtime
  `?path=` parameter at all — the security goal survived even though the Go code that
  delivered it was discarded.
- **The Phase 0 specs survived unchanged.** They were written stack-agnostic, so the Go
  detour's highest-value output — the behavioral contract — carried straight into the
  Astro port. The Go skeleton itself was parked.

The honest trade: a static site can't show a dropped file without a rebuild. That became
"watch → rebuild locally, push → deploy" — acceptable for mixed authoring, and explicitly
flagged as the trigger to revisit a server if it ever stops being acceptable.
