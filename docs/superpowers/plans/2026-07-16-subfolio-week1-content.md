# Week 1: Subfolio Double Artifact + Positioning — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Subfolio port as two cross-linked artifacts on ilano.fyi (a `projects` case study + a `writing` narrative post) plus the positioning update (headline/bio, featured flags, homepage blog visibility), as one PR in `~/local-dev/ilano-fyi`.

**Architecture:** Content-production plan, not code. "Tests" are verification: claim checks against live sources, `astro check`/`astro build`, and a rendered preview. Drafts are written from sourced material only (docs repo journey pages + changelog + user testimony), each with a Source Map. A plain-writing pass and Ryan's voice pass gate publication.

**Tech Stack:** Astro 6 "Case" theme (`~/local-dev/ilano-fyi`), MDX content collections (`projects`, `writing`), config via `.env` + `src/config.ts` fallbacks, Cloudflare deploy.

## Global Constraints

- Implementation repo: `/Users/ryan/local-dev/ilano-fyi`. Source repo (read-only): `/Users/ryan/local-dev/subfolio-astro-docs`.
- Every factual claim in published prose traces to a source listed in the Source Map file; unverifiable claims are marked `[NEEDS SOURCE]` in drafts and MUST be resolved (sourced by Ryan or cut) before `draft: false`.
- Never invent version numbers, dates, or metrics. All port metrics come verbatim from `subfolio-astro-docs/src/content/docs/docs/changes.md` and journey pages, which are themselves sourced.
- Prose passes: `plain-writing` skill (NOT humanizer), then Ryan's voice pass. Ryan's voice pass is a hard gate before publish.
- ilano.fyi is the canonical home. HN/Medium are optional post-publish steps owned by Ryan.
- Ryan's Subfolio production history (own portfolio; *Where the Trail Ends* book design; K2 Snowboarding 2012–13 boots; Red Bull Media *The Art of Flight* photo ingestion/selects) is first-person testimony — attribute as such, don't dress as third-party fact.
- The Area17 claims (client list; still-runs-Subfolio-live) publish ONLY if Task 2 verification succeeds; otherwise soften to what was verified or cut.

---

### Task 1: Branch in ilano-fyi

**Files:** none created; git state only.

**Interfaces:**
- Produces: branch `content/subfolio-week1` in `/Users/ryan/local-dev/ilano-fyi`; all later tasks commit here.

- [ ] **Step 1: Confirm clean tree and create branch**

```bash
cd /Users/ryan/local-dev/ilano-fyi
git status --porcelain        # expect empty; if dirty, stop and ask Ryan
git checkout -b content/subfolio-week1
```

Expected: `Switched to a new branch 'content/subfolio-week1'`

- [ ] **Step 2: Confirm the site builds BEFORE changes (baseline)**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npm run build
```

Expected: build succeeds. If baseline fails, stop — fix or report before adding content.

---

### Task 2: Claim-verification dossier (Source Map file)

**Files:**
- Create: `/Users/ryan/local-dev/ilano-fyi/docs/source-maps/2026-07-subfolio.md`

**Interfaces:**
- Produces: a Source Map document with a verdict line per claim (`VERIFIED <evidence-url>` / `UNVERIFIED — soften or cut`). Tasks 3–4 cite claims ONLY per these verdicts.

- [ ] **Step 1: Verify the Area17 claims with live fetches**

Use WebFetch (or curl) on each; record URL + what was observed + date:

1. `https://area17.com` (and its work/portfolio pages) — does the public portfolio list OpenAI, ElevenLabs, The New York Times as clients?
2. **`https://archive.area17.com`** — per Ryan, Area17's archive runs live on a version of Subfolio, with Subfolio components on most project pages. Verify: does it respond, do its URL patterns/page structure match Subfolio's filesystem conventions, and are there live ElevenLabs/OpenAI entries? Record exact URLs and what was observed. Also check regular area17.com project pages for Subfolio components.
3. `https://www.php.net/eol.php` — PHP 5.6 EOL 2018-12-31 (already cited in changes.md; confirm link is live).
4. `https://github.com/kohana/kohana/issues/110` — Kohana retirement 2017-07-01 (confirm link is live).

- [ ] **Step 2: Write the Source Map file**

```markdown
# Source Map — Subfolio case study + post (2026-07)

## Verdicts (from live verification, YYYY-MM-DD)
- Area17 client list (OpenAI, ElevenLabs, NYT): <VERIFIED url | UNVERIFIED — soften to what area17.com actually shows>
- Area17 still serves Subfolio-style pages for ElevenLabs/OpenAI, live links: <VERIFIED urls | UNVERIFIED — cut>
- PHP 5.6 EOL 2018-12-31: VERIFIED https://www.php.net/eol.php
- Kohana retired 2017-07-01, last release 3.3.6 (2016-07-25): VERIFIED https://github.com/kohana/kohana/issues/110

## Document sources (docs repo, read-only)
- changes.md — perf table (fonts 906.5KB→47.3KB; CSS 93.5KB→84.4KB minified; WebP/AVIF −64…−93% preview; HTML 13.4KB→13.5KB vs 20KB budget), architecture table, `-access` parsed-not-enforced honesty note
- journey/why-the-port.md — path traversal at Filebrowser.php:179; MD5 + single global salt auth; plaintext passwords in users.yml; Grunt on Node 8; Go detour (chi/scs/bcrypt ADRs, Phase 0 behavior specs survived); Target C decision
- journey/deepseek-workflow.md — LLM workflow + cost ledger
- journey/architecture.md, performance.md, seo.md, security.md, free-deploy.md
- git history of github.com/ryanilano/subfolio-astro

## First-person testimony (attribute to Ryan, not as external fact)
- Used Subfolio in production: own portfolio; *Where the Trail Ends* book design; K2 Snowboarding 2012–13 boot design/branding; Red Bull Media *The Art of Flight* photo ingestion/selects
```

Fill every `<...>` with the actual Step 1 result before committing — a `<...>` left in the file is a task failure.

- [ ] **Step 3: Commit**

```bash
cd /Users/ryan/local-dev/ilano-fyi
git add docs/source-maps/2026-07-subfolio.md
git commit -m "docs: source map + claim verification for Subfolio content"
```

---

### Task 3: Project case study — `projects/subfolio-astro-port.mdx`

**Files:**
- Create: `/Users/ryan/local-dev/ilano-fyi/src/content/projects/subfolio-astro-port.mdx`
- Read for conventions: `src/content/projects/k2-snowboarding.mdx` (frontmatter + MDX component style)
- Read for facts: docs-repo pages listed in the Source Map

**Interfaces:**
- Consumes: Source Map verdicts (Task 2).
- Produces: project entry with slug `subfolio-astro-port`, `featured: true`; the writing post (Task 4) links to `/projects/subfolio-astro-port`.

- [ ] **Step 1: Write frontmatter (schema: `src/content.config.ts` projectsCollection)**

```yaml
---
title: "Subfolio, Resurrected: Porting Area17's Filesystem CMS"
role: "Designer & Developer (LLM-assisted solo port)"
year: 2026
duration: "3 weeks"
outcomeSummary: "Ported Area17's Subfolio from EOL PHP 5.6/Kohana to a static Astro build — same filesystem conventions, zero servers, with the original's path-traversal class of bugs eliminated by construction."
overview: "Subfolio is a filesystem-as-CMS: folders and file-naming conventions become galleries and presentation pages. I used it in production for years. Its stack died (PHP 5.6 EOL 2018, Kohana retired 2017), so I ported the engine to build-time Astro — driving Claude through the port while my web-dev and performance background steered decisions an LLM wouldn't volunteer."
problem: "Genuinely great software stranded on a dead stack: PHP 5.6 (EOL 2018-12-31) on Kohana 2.x (retired 2017-07-01), with documented security debt — a path-traversal file read, MD5 single-salt auth, plaintext-capable user store — and a Grunt-on-Node-8 front-end pipeline."
constraints:
  - "A port, not a rewrite: the directory/ content conventions had to carry over unchanged"
  - "Zero hosting cost target (static, Cloudflare Pages free tier)"
  - "Solo, evenings-scale effort — LLM leverage was a requirement, not a flourish"
keyDecisions:
  - decision: "Static Astro build instead of the Go rewrite already in progress"
    reasoning: "A behavior inventory showed every hard requirement (thumbnails, listings, embeds, RSS, zips) resolves at build time; only auth/gated-serving needs a server, and those were nice-to-have. Static kills the path-traversal bug by construction — no runtime ?path= exists."
    alternatives:
      - "Go single static binary (Phase 0/1 actually built, then parked; its stack-agnostic behavior specs carried into the Astro port)"
      - "Upgrade PHP in place (impossible: Kohana 2.x cannot run on PHP 8)"
  - decision: "Keep the original directory/ naming conventions byte-for-byte"
    reasoning: "The conventions are the product. Porting the engine underneath them preserves a decade of existing content and the workflow that made Subfolio worth saving."
  - decision: "Parse but do not fake -access enforcement"
    reasoning: "The static port parses -access rules as typed data but cannot enforce them without a Worker; the docs say so plainly rather than implying security that isn't there."
techStack:
  - "Astro"
  - "TypeScript content loaders"
  - "Cloudflare Pages"
  - "Claude (port driver)"
  - "DeepSeek (offload workflow)"
impact:
  metrics:
    - label: "Font payload"
      value: "906.5 KB → 47.3 KB"
    - label: "Hosting cost"
      value: "$0 (static, Cloudflare Pages)"
    - label: "Runtime CVE surface"
      value: "EOL PHP runtime → none (no server)"
  qualitative: "The engine that Area17 built — and that I used on real client work for years — runs again on a maintained stack, same content conventions, no server to patch."
learnings:
  - "LLMs are exceptional at porting when a human supplies the behavioral contract — the stack-agnostic Phase 0 specs were the highest-leverage artifact in the project"
  - "Domain knowledge decided the big calls: build-time vs request-time analysis, variable-font subsetting, and honest non-enforcement of -access came from web-dev experience, not from the model"
featured: true
status: completed
order: 1
---
```

(`heroImage`/`thumbnail` intentionally omitted from this step — added in Task 6 from Ryan's screenshots; schema marks them optional so the build stays green meanwhile.)

- [ ] **Step 2: Write the body**

Follow `k2-snowboarding.mdx` component style (`TwoColumn` intro + `Img` blocks where images exist). Body sections, each fact per Source Map:

1. **Background** — what Subfolio is; Area17 pedigree phrased per Task 2 verdicts; Ryan's production history with it (first person).
2. **Why it had to move** — EOL dates, the four documented security/pipeline issues from why-the-port.md.
3. **The changelog, annotated** — table from changes.md (before/after), each row tagged **[LLM-driven]** or **[domain-judgment]**. Minimum four domain-judgment rows: Go-detour pivot, variable-font consolidation, honest `-access` stance, 20KB HTML budget.
4. **What the LLM did well / what it wouldn't have done** — the core-angle section.
5. **Proof** — links: live demo (github.io), docs site, `github.com/ryanilano/subfolio-astro`, the port journey pages.

End the body with an HTML comment source map: `{/* Source map: docs/source-maps/2026-07-subfolio.md */}`

- [ ] **Step 3: Verify schema + build**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npx astro check && npm run build
```

Expected: no content-collection schema errors; build passes.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects/subfolio-astro-port.mdx
git commit -m "content: add Subfolio port case study (draft)"
```

---

### Task 4: Writing post — `writing/resurrecting-subfolio.mdx`

**Files:**
- Create: `/Users/ryan/local-dev/ilano-fyi/src/content/writing/resurrecting-subfolio.mdx`
- Read for conventions: `src/content/writing/local-ai-workflow.mdx`, `endtroducing.mdx`

**Interfaces:**
- Consumes: Source Map verdicts; case study slug `subfolio-astro-port` (Task 3).
- Produces: writing entry, slug `resurrecting-subfolio`, `draft: true` until Task 7 gate; case study links to `/writing/resurrecting-subfolio`.

- [ ] **Step 1: Write frontmatter**

```yaml
---
title: "Resurrecting Subfolio: Bringing a Dead Agency Tool Back with an LLM and Twenty Years of Web Dev"
description: "Area17's filesystem CMS was stranded on PHP 5.6. I ported it to a static Astro build by pairing Claude with the domain knowledge to steer it — here's the changelog, and who (human or model) drove each change."
publishDate: 2026-07-18
tags:
  - "llm-workflow"
  - "web-performance"
  - "subfolio"
draft: true
featured: true
order: 1
---
```

(`publishDate` = intended publish day this week; adjust to actual day at the Task 7 gate. Series tag added at the gate too — see Task 7.)

- [ ] **Step 2: Write the body (narrative counterpart of the case study, not a copy)**

Section outline with sourcing:

1. **The software worth saving** — what filesystem-as-CMS means; Area17 pedigree per verdicts; "I used this for years" with the four named productions (first person). Hook: great tools deserve better than dying with their runtimes.
2. **Dead stack, documented debt** — EOL dates; path traversal at `Filebrowser.php:179`; MD5 single-salt; Grunt/Node 8. All cited.
3. **The port: who drove what** — the changelog walk. Explicit two-thread structure: *[LLM-driven]* items with what good driving looked like (behavior specs first, bounded asks) vs *[domain-judgment]* items an LLM wouldn't volunteer (the static-vs-server behavior inventory, killing the Go rewrite despite sunk cost, font/perf budgets, refusing to fake `-access` security).
4. **What this says about working with LLMs** — the takeaway: leverage × judgment, not output accepted as-is. One paragraph, no sermon.
5. **See it** — demo, docs-site journey, case study link (`/projects/subfolio-astro-port`), repo.

End with the same source-map comment as Task 3.

- [ ] **Step 3: Verify + commit**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npx astro check && npm run build
git add src/content/writing/resurrecting-subfolio.mdx
git commit -m "content: add Subfolio narrative post (draft: true)"
```

---

### Task 5: Positioning update

**Files:**
- Modify: `/Users/ryan/local-dev/ilano-fyi/.env` (local, not committed)
- Modify: `/Users/ryan/local-dev/ilano-fyi/src/config.ts` (committed fallbacks: lines ~66, ~89–95, ~73–76)

**Interfaces:**
- Consumes: nothing. Produces: new site headline/bio strings; homepage blog section enabled so featured writing shows.

- [ ] **Step 1: Update `.env` values**

Replace these lines (Ryan may reword at the Task 7 gate — these are the approved working direction):

```bash
SITE_AUTHOR_TITLE="Product Designer × Engineer — LLM Tooling, Design Systems, Infrastructure"
SITE_AUTHOR_BIO="Staff product designer who builds: modern web stacks, LLM-assisted software, and the infrastructure underneath."
SITE_TITLE="Ryan Ilano — Product Design × Engineering"
SITE_DESCRIPTION="Portfolio of Ryan Ilano: staff-level product design plus shipped LLM tooling, web performance, and homelab infrastructure."
SHOW_HOMEPAGE_BLOG=true
```

- [ ] **Step 2: Mirror the same strings into `src/config.ts` fallbacks** (title line ~66, description ~73–76, author.title ~89–95, author.bio ~95) so the committed defaults match production intent.

- [ ] **Step 3: Verify homepage renders featured items**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npm run build && npm run preview &
# open http://localhost:4321 — homepage must show: new headline/bio, Subfolio case study card in featured projects, blog section visible
```

Then stop the preview server.

- [ ] **Step 4: Commit (config.ts only — never commit .env)**

```bash
git add src/config.ts
git commit -m "feat: positioning update — design × engineering headline, homepage blog on"
```

- [ ] **Step 5: Record the deploy-time note** — add to the PR description (Task 8): "Cloudflare project env vars must be updated to match .env (SITE_AUTHOR_TITLE, SITE_AUTHOR_BIO, SITE_TITLE, SITE_DESCRIPTION, SHOW_HOMEPAGE_BLOG) — Ryan does this in the dashboard at merge time."

---

### Task 6: Images

**Files:**
- Create: `/Users/ryan/local-dev/ilano-fyi/src/assets/projects/subfolio-astro-port/` (Ryan-supplied screenshots)
- Modify: both MDX files' frontmatter (`heroImage`, `thumbnail`) and bodies (`<Img>` blocks)

**Interfaces:**
- Consumes: Ryan supplies 2–4 images (demo screenshots, before/after, or the docs site). This is a Ryan-input step: request them at the Task 7 gate if not provided sooner.

- [ ] **Step 1: Place images, reference them** — `heroImage`/`thumbnail` in both files' frontmatter (2:1 aspect for writing thumbnails per theme convention), `<Img src="projects/subfolio-astro-port/..." alt="...">` in bodies with real alt text.
- [ ] **Step 2: Rebuild, verify, commit**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npm run build
git add src/assets/projects/subfolio-astro-port src/content
git commit -m "content: add Subfolio artwork to case study and post"
```

If Ryan has no images ready, this task may ship after the gate as a follow-up commit on the same branch — both schemas tolerate missing images. Do not block the PR on it; note it in the PR description instead.

---

### Task 7: Prose gate — plain-writing pass, then Ryan's voice pass

**Files:**
- Modify: both MDX bodies (prose only, never the sourced numbers/dates)
- Create: plain-writing revision HTML (skill output) for Ryan's review

**Interfaces:**
- Consumes: Tasks 3–4 drafts. Produces: publish-ready prose; final `draft: false`; final series tag.

- [ ] **Step 1: Invoke the `plain-writing` skill** over both MDX bodies. Save its revision HTML where Ryan can open it. Numbers, dates, URLs, and claim wording per Source Map are exempt from stylistic rewriting.
- [ ] **Step 2: Sweep for `[NEEDS SOURCE]`**

```bash
grep -rn "NEEDS SOURCE" /Users/ryan/local-dev/ilano-fyi/src/content && echo "STOP: unresolved claims" || echo "clean"
```

Expected: `clean`. If not, resolve with Ryan (source or cut) before proceeding.

- [ ] **Step 3: Ryan's voice pass (HARD GATE — user action)** — Ryan reviews the preview + revision HTML; edits prose; confirms/rewords the positioning strings from Task 5; picks the series tag from candidates: `after-the-subsidy`, `hands-on-the-metal`, `ai-in-practice` (his call, or his own). Apply the chosen tag to the post frontmatter (and retroactively to `local-ai-workflow.mdx` if he wants the May post in the series).
- [ ] **Step 4: Flip `draft: false` on the writing post, rebuild, commit**

```bash
cd /Users/ryan/local-dev/ilano-fyi && npm run build
git add src/content
git commit -m "content: Subfolio post final — voice pass applied, published"
```

---

### Task 8: PR + distribution kit

**Files:**
- Create: `/Users/ryan/local-dev/ilano-fyi/docs/distribution/2026-07-subfolio.md` (LinkedIn draft + checklist)

**Interfaces:**
- Consumes: everything above. Produces: the PR; a LinkedIn draft for Ryan's edit; the distribution checklist.

- [ ] **Step 1: Write the distribution kit** — a LinkedIn post draft in first person (~150 words, no hashtag spam: the hook is "the agency tool I used on K2/Red Bull work died with PHP 5 — so I brought it back with an LLM and 20 years of web dev"), plus checklist: LinkedIn (Ryan edits + posts), optional Show HN (Ryan's call, no pressure), optional Medium import with canonical URL, add post URL to active applications.
- [ ] **Step 2: Commit, push, open PR**

```bash
cd /Users/ryan/local-dev/ilano-fyi
git add docs/distribution/2026-07-subfolio.md
git commit -m "docs: distribution kit for Subfolio post"
git push -u origin content/subfolio-week1
gh pr create --title "Week 1: Subfolio case study + post + positioning" --body "$(cat <<'EOF'
Two cross-linked artifacts (projects/subfolio-astro-port, writing/resurrecting-subfolio) + positioning update per docs/superpowers/specs/2026-07-16-ai-showcase-content-plan-design.md (subfolio-astro-docs repo).

- [ ] Cloudflare env vars updated to match .env (Ryan, at merge)
- [ ] Images added (Task 6) or tracked as follow-up
Source map: docs/source-maps/2026-07-subfolio.md
EOF
)"
```

- [ ] **Step 3: Verify PR exists and CI/deploy preview passes** — `gh pr view --web`; confirm the Cloudflare preview build renders both pages and the new homepage.

---

## Self-Review (done at write time)

- **Spec coverage:** double artifact (Tasks 3–4), positioning + featured flags + homepage visibility (Task 5, frontmatter in 3–4), changelog-driven core angle with the two threads (Tasks 3–4 bodies), claim verification incl. Area17 (Task 2), plain-writing + voice pass + `[NEEDS SOURCE]` gate (Task 7), one PR + distribution checklist with optional HN/Medium (Task 8). Cross-links both directions (Tasks 3–4). ✓
- **Placeholders:** the only deferred items are explicit user-input gates (images, voice pass, series-tag choice) with concrete options and fallbacks — no TBDs an executor must invent. ✓
- **Consistency:** slugs `subfolio-astro-port` / `resurrecting-subfolio` used identically in Tasks 3, 4, 7, 8; branch name consistent; source-map path consistent. ✓
