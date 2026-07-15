---
title: Security
description: The attack surface a static port removes, what it deliberately doesn't cover yet, and one honest incident postmortem.
---

## What going static removes

The original stack's security posture was the main reason to
[leave it](/subfolio-astro-docs/docs/journey/why-the-port/): an unpatched EOL runtime, a
retired framework, a path-traversal bug, and MD5-with-global-salt auth. The static port
doesn't *fix* most of that so much as **remove the places it lived**:

- **No request-time code.** There is no PHP process, no Kohana dispatch, no `?path=`
  parameter — the deployment ADR notes the traversal bug "disappears by construction"
  because build-time path resolution is jailed to the content root and nothing resolves
  paths at request time.
- **No auth endpoints to get wrong.** The old app exposed `/hash/{password}` — a hash
  generator on the open web — and accepted plaintext passwords in `users.yml`. A static
  site has no login surface at all (and the deferred Worker design specifies Web
  Crypto/`scrypt`, not salted MD5, if it's ever built).
- **No server to patch.** The runtime treadmill that killed the original stack has no
  analog for static files.

## What it deliberately doesn't do (yet)

Stated plainly, as the engine docs insist everywhere:

- **`-access` rules are parsed, not enforced.** The loader captures them as typed data;
  until the optional Cloudflare Worker exists, **everything served is public**, whether or
  not a folder carries an `-access` file. See
  [the convention page](/subfolio-astro-docs/docs/conventions/access/).
- **Hidden is not private.** `-hidden` items are excluded from listings, but a hidden
  file's URL still serves if requested directly.

## The guard that does exist

Serving a content tree that is also a git checkout means repo metadata is a real hazard.
The raw-bytes route
([`src/pages/directory/[...path].ts`](https://github.com/ryanilano/subfolio-astro/blob/main/src/pages/directory/%5B...path%5D.ts))
carries an `isBlockedName()` guard: **dot-prefixed entries** (`.git`, `.DS_Store`, …) and
**`-access` files** are filtered out at walk time and 403'd in dev — repo and OS metadata
is never served, with a regression test pinning the behavior.

That guard exists because of an incident.

## Postmortem: the `.env` leak

For a whole milestone, the test suite carried "2 known pre-existing failures." The
deep-dive that finally chased them found they were never two bugs — **they were one live
leak** (session note:
[`docs/notes/2026-07-02-deep-dive-remediation.md`](https://github.com/ryanilano/subfolio-astro/blob/main/docs/notes/2026-07-02-deep-dive-remediation.md)).

The mechanism: Astro loads `.env` into `process.env` at *render* time but not at *config*
time. With `SUBFOLIO_CONTENT_DIR` set in `.env`, every plain `npm run build` was
**split-brain** — the loader (config time) walked the bundled fixture while the route
modules (render time) walked the live content repo. That mismatch failed two smoke tests
— and **published the content repo's `.git/`, `.github/`, and `.claude/` directories into
`dist/directory/`**, which went public via one local `npm run deploy`. CI was never
affected (no `.env` there), which is exactly why the live site looked fine while local
tests stayed red.

The remediation, all merged and documented:

- `.env` → **`.env.content`**, a file Astro never reads, consumed only by an explicit
  `dev-content.sh` wrapper (README: "Why `.env.content`").
- The **`isBlockedName()` leak guard** above, with a regression test.
- Stale tests corrected against upstream-PHP ground truth, and the CI gate wired so the
  smoke + SEO suites run before every deploy — a gate that **blocked a real regression on
  its first live run**.
- The lesson, promoted into the engine's agent guidance: **never normalize a red test as
  "known-failing."** Both "known failures" were one live leak.

No secrets were involved — the leaked content was repo metadata — but the writeup is kept
because the shape of the failure (config-time vs render-time env, a tolerated red test, a
local deploy path that skips CI) is more instructive than the blast radius.
