# AI Showcase Content Plan — Design

**Date:** 2026-07-16
**Status:** Approved pending user review
**Implementation repo:** `~/local-dev/ilano-fyi` (posts, case study, positioning) — this spec lives in the Subfolio docs repo because post 1 sources from it.

## Goal

Ryan is a staff product designer (11 years) entering a job market that demands LLM and code fluency. He has an unusual, indisputable body of evidence: shipped LLM-assisted software (the Subfolio Astro port), real infrastructure/virtualization depth (Proxmox homelab), and a documented cost-optimization workflow using open-weight models. This plan turns that evidence into three published blog posts plus site positioning, targeted at roles in the Design Engineer / AI-adjacent space — something between staff product designer and design engineer, with the infra/devops background legible.

**Audience:** a deliberate mix — written for technical peers (engineers, homelab folks, AI practitioners) but structured so hiring managers see the skill signals fast.

**Urgency:** active job search. First post live within week 1; ~1 post/week after.

## The narrative arc

Three posts, one worldview — *craft → infrastructure → economics*:

1. **Subfolio port** — "I ship real things with LLMs" (craft + judgment)
2. **Local AI on consumer hardware** — "I understand the infrastructure layer" (metal + models)
3. **The rug pull hedge** — "I understand the economics and where this is going" (strategy)

Published as a named series. Series name TBD at drafting (candidates generated then; e.g. "Hands on the Metal," "After the Subsidy"). Series membership is expressed with a shared tag in the `writing` collection plus a one-line arc placement in each intro and a pointer to the next post in each outro. No theme modifications required.

## Positioning (ships with post 1)

- **Headline/bio update** on ilano.fyi. Working direction (final words chosen by Ryan at edit time): "Staff product designer who builds — modern web stacks, LLM tooling, and the infrastructure underneath." No forced job title; the work argues for the label.
- **Featured flags:** post 1 (`writing`, `featured: true`) and the Subfolio case study (`projects`, `featured: true`) appear in the homepage highlight areas the Case theme already provides.
- Deferred (explicitly out of scope, decided later): full site overhaul; a dedicated "AI work" hub page is the natural first move of that overhaul.

## Artifacts

### Week 1 — The Subfolio double artifact

Two cross-linked entries telling one story:

**A. Project case study** (`projects` collection): "Porting Subfolio: resurrecting Area17's filesystem CMS from PHP 5."
Uses the theme's structured schema: problem → constraints → approach → key decisions (with alternatives) → tech stack → impact → learnings.

- **Problem:** genuinely great software — filesystem-as-CMS for presenting work and browsing large file sets — stranded on PHP 5/Kohana (EOL 2018), with real security issues and dependencies dead for over a decade.
- **Personal authority:** Ryan used Subfolio in production for years — his own portfolio, the *Where the Trail Ends* book design, K2 Snowboarding boot design/branding (2012–13), and photo ingestion/selects for Red Bull Media's *The Art of Flight*. This history is why he could judge it worth saving and steer the port. (K2 assets already exist on the site — corroborates the case-study material.)
- **Approach:** Claude-driven port to a modern Astro stack, with Ryan's frontend/web-stack modernization judgment steering.
- **Proof links:** live demo, docs site (this repo), git history.

**B. Writing post** (`writing` collection): the narrative version — what Subfolio was (Area17 pedigree), why it deserved resurrection, and what driving Claude through a legacy port is actually like when you have the domain knowledge to steer. The shareable artifact; the case study is the evidence artifact. Each links to the other.

**Core angle for both artifacts (Ryan's emphasis):** structure the story around the changelog — what changed, and *why* each change was made. Two threads run through it: (1) where LLMs genuinely helped and how to drive them well, and (2) where Ryan's web-dev and performance domain knowledge produced improvements an LLM alone would likely never suggest. Each changelog-driven example is tagged to one of those threads. The takeaway a hiring manager should leave with: LLM leverage multiplied by domain judgment — not LLM output accepted as-is. Source the change list from the docs changelog (`changes.md`), the journey docs, and git history.

**Sources for both:** this repo's journey docs (`why-the-port`, `architecture`, `security`, `performance`, `seo`, `free-deploy`, `deepseek-workflow`), git history, live demo.

### Week 2 — Post 2: Local AI on consumer hardware

Working title direction: "What a 16GB graphics card can actually do in 2026."

Scope (single post; a deeper series is parked for later): honest state of local models on mid-range NVIDIA (~16GB VRAM) and Apple on-device silicon; the steep progress since May 2026; the Proxmox + VM lab as testbed (its own section — the infra flex); one or two concrete install/run walkthroughs; practical uses that hold up. Framing: not state-of-the-art, but remarkable and real — "you can do this."

**Sources:** Ryan's lab and real runs. Any capability claim is demonstrated or cited — no benchmark numbers from memory.

**Drafting note:** Ryan has already written most of this post (or substantial chunks). For post 2 the drafting model inverts: Ryan's existing draft is the source of truth; Claude structures, tightens, and fact-checks it rather than drafting from scratch. Ryan to point at where the draft material lives.

### Week 3 — Post 3: The rug pull hedge

Working title direction: "The subsidy will end: what Uber teaches us about AI pricing."

Thesis: the subscription-vs-API price gap evidences VC subsidy, echoing rideshare/food-delivery; when the rug pull comes, the hedge is routing work from familiar tools (Claude Code) to open-weight models — which Ryan already did, by hand, no off-the-shelf harness, at roughly 10x lower cost, with documentation. Closes the arc: you don't need state-of-the-art for everything.

**Sources:** the DeepSeek workflow docs in this repo, Ryan's usage/cost records. All pricing cited from published prices at draft time, never memory.

## Cadence, distribution, process

- **Week 1:** case study + post 1 + positioning update, one PR in `ilano-fyi`. **Week 2:** post 2. **Week 3:** post 3. Each post is its own spec→draft→edit cycle under this umbrella plan.
- **Per-post distribution checklist:** LinkedIn post drafted in Ryan's voice for his edit; HN optional and entirely Ryan's call per post (posts 2–3 are HN-shaped; post 1 possibly "Show HN" with the demo); optional Medium syndication via Medium's import tool so the canonical URL stays on ilano.fyi; post URL added to active applications. ilano.fyi is always the canonical home.
- **Drafting model:** Claude drafts from sources with a source map appendix; a **plain-writing pass** on the prose (the `plain-writing` skill — simple words, no filler, no AI-isms, with an HTML diff of edits Ryan can review); Ryan does the voice/color pass; claim verification; publish (`draft: false`, featured flags as decided).

## Quality gates (source accuracy)

- Every factual claim traces to a source doc/section; drafts include a Source Map appendix.
- Unverifiable claims are flagged `[NEEDS SOURCE]` and are sourced by Ryan or cut before publish.
- Opinions are allowed and labeled as Ryan's take, never dressed as fact.
- **Claims requiring verification at draft time:**
  - Area17's client work (OpenAI site, ElevenLabs, New York Times) — verify against Area17's public portfolio before printing.
  - Area17 still runs Subfolio in production on its live site, with live links for the ElevenLabs and OpenAI entries — verify against the live URLs and capture evidence (links, observable Subfolio URL/structure signatures).
  - PHP 5 / Kohana EOL dates and security posture — cite.
  - Subscription-vs-API pricing gap figures and the "~10x cheaper" claim — cite published prices and Ryan's records.
  - Local-model capability claims — demonstrate in the lab or cite.

## Non-goals

- Full ilano.fyi overhaul (deferred; decided after the three posts).
- Dedicated AI-work hub page (first move of the overhaul, not this plan).
- Case theme modifications or new collections — existing `projects` and `writing` collections suffice.
- Turning post 2 into a multi-part series now.

## Success criteria

- Three posts + one case study live on ilano.fyi within ~3 weeks, cross-linked as a series.
- Positioning (headline + featured artifacts) live with post 1 in week 1.
- Every published claim sourced or cut; zero `[NEEDS SOURCE]` markers in published posts.
- Each post has its distribution checklist executed (LinkedIn; HN where fitting; links in applications).
