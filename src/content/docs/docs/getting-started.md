---
title: Getting Started
description: Install, run the dev server, point the loader at real content, and produce your first build.
---

## Install

```sh
npm install      # Node 24 (see .nvmrc)
```

## Run

```sh
npm run dev      # astro dev → browse the rendered listing/detail pages
```

## Point it at your content

The loader reads `SUBFOLIO_CONTENT_DIR`, defaulting to the bundled `content/examples/`
fixture so the repo runs standalone. Point it at a live Subfolio install's `directory/`
to run against real content.

Set it in `.env.content` (gitignored):

```sh
SUBFOLIO_CONTENT_DIR=/path/to/subfolio/directory
```

Then run through `./dev-content.sh` instead of `npm` directly. Astro only loads
dotenv values at render time — not at config time when the loader resolves the
content directory, and the `gen-*` scripts read no dotfile at all — so the wrapper
promotes `SUBFOLIO_CONTENT_DIR` from `.env.content` to a real exported shell var
before either build phase runs:

```sh
./dev-content.sh          # npm run dev
./dev-content.sh build    # npm run build
./dev-content.sh preview  # npm run preview
```

Plain `npm run dev` still works — it just falls back to `content/examples/`.

## First build

```sh
npm run build    # astro check (types) + astro build
npm run preview  # serve the static build locally
```

Every convention in the [Conventions reference](/subfolio-astro-docs/docs/conventions/)
is exercised by the bundled fixture, so a plain `npm run build` is enough to see
everything render — no live content needed to get started.
