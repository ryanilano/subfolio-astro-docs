# Subfolio-Astro Branding Consistency Pass — Design

**Date:** 2026-07-15
**Status:** Approved

## Goal

In body copy and user-visible display strings, the Astro port is always called
**Subfolio-Astro** (capital S, capital A, hyphenated). Mentions of the original
AREA17 PHP product, the `directory/` tree format, and code identifiers keep the
plain "Subfolio" name. No link target, URL, code span, base path, or repo name
changes.

## Background

An inventory of the docs (`src/content/docs/`) found:

- 82 lowercase `subfolio-astro` tokens — **all** inside link paths
  (`/subfolio-astro-docs/...`), GitHub URLs
  (`github.com/ryanilano/subfolio-astro/...`), or the domain
  `subfolio-astro.ilano.fyi`. None are body copy; none change.
- 1 correct prose `Subfolio-Astro` (`changes.md:6`).
- ~20 plain "Subfolio" mentions in prose/display strings, split between the
  original PHP product, the directory-tree format, code identifiers, and the
  port-as-product. Only the port-as-product mentions are rebranded.

## Approach

Curated line-by-line edit pass (Approach A). Each mention was classified
manually; no regex replacement is applied to files. Rationale: the decision at
each site is semantic — "The original Subfolio ran on PHP 5.6" must stay — so
no find-and-replace rule is safe.

## Edits (6)

| Location | Current | New |
|---|---|---|
| `src/content/docs/docs/index.md:2` | `title: Subfolio Documentation` | `title: Subfolio-Astro Documentation` |
| `src/content/docs/docs/index.md:6` | "Subfolio turns a folder of files into a themeable website…" | "Subfolio-Astro turns…" |
| `src/content/docs/docs/index.md:16` | "New to Subfolio? Start with…" | "New to Subfolio-Astro? Start with…" |
| `src/content/docs/docs/conventions/index.mdx:3` | description: "How Subfolio reads plain file and folder names…" | "How Subfolio-Astro reads…" |
| `src/content/docs/docs/conventions/index.mdx:6` | "Subfolio has no CMS and no database." | "Subfolio-Astro has no CMS and no database." |
| `astro.config.mjs:15` | Starlight `title: 'subfolio-astro-docs'` | `title: 'Subfolio-Astro Docs'` (display-only; `/subfolio-astro-docs/` base path and repo name untouched) |

`changes.md:6` ("Subfolio-Astro is a **port**…") is already correct — verify
only, no change.

## Explicitly kept as-is (13 mentions)

**Original PHP product:**

- `changes.md:14` — "The original Subfolio ran on Kohana 2.x / PHP 5.6"
- `why-the-port.md:8` — "The original Subfolio ran on Kohana 2.x / PHP 5.6"
- `free-deploy.md:8` — "Running PHP Subfolio meant operating a server"
- `free-deploy.md:27` — "hosts the original Subfolio's docs"
- `journey/index.mdx:7` — "taking Subfolio from a dead Kohana 2.x / PHP 5.6 stack"
- `journey/index.mdx:3` — "the Subfolio port" (reads as "the port *of* Subfolio")

**Directory-tree format:**

- `getting-started.md:21` — "a live Subfolio install's `directory/`"
- `free-deploy.md:38` — "an unmodified Subfolio `directory/` tree"
- `journey/index.mdx:24` — "a Subfolio `directory/` tree"
- `folder-suffixes.mdx:24` — "inside a Subfolio tree"

**Code identifiers (backticked):**

- `changes.md:28` — `Subfolio.php`
- `architecture.md:19` — `Filebrowser`/`Subfolio`/`Access`
- `architecture.md:27` — `Subfolio.php`
- `journey/index.mdx:20` — `Subfolio.php`

**All 82 lowercase `subfolio-astro` tokens** — link paths, GitHub URLs, domain
names. None change.

## Verification

1. `git diff` audit — no diff line touches a `](…)` link target, `http` URL,
   or backticked span.
2. Re-run inventory greps — expect exactly 6 prose/display `Subfolio-Astro`
   occurrences in content (5 in markdown + the existing `changes.md:6`) plus
   the config title; keep-list unchanged.
3. `npm run build` — site builds clean; any link-checker failure is a hard
   stop (it would mean a link was touched).

## Judgment call recorded

The Conventions pages describe behavior shared with the original product, but
since this site documents the port, they take the port name (user-approved).

## Non-goals

- No changes to link targets, URLs, slugs, base paths, repo names, or
  `package.json`.
- No blanket rename of "Subfolio" where it means the original product or the
  tree format.
- No lint/CI branding guard (Approach C was declined).
