---
title: Architecture
description: Request-time PHP to build-time static — what carried over, what was rewritten, and where each behavior went.
---

The port's first rule, from the engine's
[`docs/ROADMAP.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ROADMAP.md):
this is a *port* that preserves the look and the content conventions, **not a redesign**.
The new engine reads the *same* `directory/` content tree as the PHP app, so old and new
could run side-by-side on identical content for diffing. No data migration, ever.

## What carried over vs. what was rewritten

Quoted from the engine roadmap:

| Carries over ~as-is | Gets rewritten |
|---|---|
| SCSS/CSS, fonts, images, SVG icons | View *logic* (PHP views → Astro components) |
| `directory/` content + all naming conventions | The Kohana engine (`Filebrowser`/`Subfolio`/`Access`) → an Astro content loader |
| YAML config (settings/filekinds/users/groups) | YAML loading (Spyc → the `yaml` npm library) |
| URL structure / routes | Auth (custom salt → Web Crypto/`scrypt`, in the deferred Worker) |

## Request-time, then build-time

**The PHP original** answered every page view at request time: Apache `htaccess` rewrote
each URL into Kohana's front controller, which wired up singleton libraries
(`Filebrowser.php`, `Subfolio.php`, `Access.php`, `FileKind.php`) on *every request*, then
walked the directory, sorted, resolved thumbnails, and rendered PHP views. The front
controller set a **2 GB memory limit** just for thumbnail generation.

**The Astro port** does all of that exactly once, at build time. A custom content loader
([`src/loaders/`](https://github.com/ryanilano/subfolio-astro/tree/main/src/loaders))
walks the tree, interprets every naming convention — hidden items, `-t-`/`-m-`/`-b-`
embeds, `.link`/`.cut`/`.pop`/`.ftr`/`.slide`/`.oplx`/`.rss` enhancers, `-access` rules —
and emits **typed folder entries** validated by a Zod schema. What ships to the host is
static files; there is no server, no database, and no per-request code path at all.

## Where each request-time behavior went

The deployment ADR resolved the PHP engine's behavior inventory one row at a time
([`docs/ADR-deployment.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/ADR-deployment.md)):

| Request-time behavior (PHP) | Where it lives now |
|---|---|
| Thumbnail generation (resize-if-stale) | **Build time** via `sharp` — the spec is literally "resize when thumb older than source" |
| Listings, hidden filtering, filekind mapping | **Build time** — pure functions over the tree |
| `-properties`/`.info` YAML, embeds, `.ftr` features | **Build time** — precomputed into the collection |
| RSS `.rss` fetch + cache | **Build time** fetch |
| `.oplx` → on-the-fly ZIP | **Build time** prebuilt `.zip` artifact |
| Sort preferences (session `?sort=`) | **Client side** — localStorage + JS re-sort |
| Mobile detection → grid mode | **Client side** — responsive CSS |
| Live file-drop visibility | **The one real trade-off** — replaced by watch→rebuild / push→deploy |
| Login, sessions, `-access` gating | **Deferred** to an optional Cloudflare Worker (not built) |

Behaviors that couldn't run at build time weren't faked — they were captured as **parsed
intent**: the loader parses `-access` YAML into typed allow/deny rules on each entry, but
[enforcement is deferred](/subfolio-astro-docs/docs/conventions/access/) and everything
served is public until the Worker exists.

## Spec-first porting

Before any Astro code, Phase 0 extracted the PHP engine's behavior into **eight
stack-agnostic specs**
([`docs/spec/`](https://github.com/ryanilano/subfolio-astro/tree/main/docs/spec)) —
conventions, filekinds, routes, thumbnails, theme API, config, auth, access. They were
written for a Go port, survived the [pivot to Astro](/subfolio-astro-docs/docs/journey/why-the-port/)
unchanged, and remain the source of truth the loader and tests are checked against.

## Small fidelity details that mattered

- **Two URL namespaces preserved** — HTML pages at the same paths as the PHP controller,
  raw bytes under `/directory/<path>` — so the two engines could be diffed URL-for-URL on
  the same content.
- **Lenient YAML, on purpose.** The PHP app's bundled Spyc parser tolerated malformed user
  YAML; the port normalizes legacy Spyc quirks (`key:>` → `key: >`) and falls back to `{}`
  on parse failure, so one bad file can't break a build — matching the old behavior.
- **Hidden still isn't gone.** `-hidden` and dot-prefixed items are excluded from listings
  but still read explicitly for embeds, features, and shortcuts — same as the PHP engine.
