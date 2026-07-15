# Subfolio-Astro Branding Consistency Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the Astro port's product name to **Subfolio-Astro** in body copy and display strings only — 6 exact line edits — leaving every link target, URL, code span, and reference to the original PHP Subfolio untouched.

**Architecture:** Pure documentation/config edits. Each edit is a verbatim string replacement at a known file and line, taken from the approved spec (`docs/superpowers/specs/2026-07-15-subfolio-astro-branding-design.md`). Verification is grep-based: an inventory grep before and after, a `git diff` audit, and a site build.

**Tech Stack:** Astro 5 + Starlight docs site. Markdown/MDX content in `src/content/docs/`. Build via `npm run build`.

## Global Constraints

- The product spelling is exactly `Subfolio-Astro` — capital S, capital A, hyphen, no space.
- NEVER modify: link targets (`](/subfolio-astro-docs/...)`), GitHub URLs (`github.com/ryanilano/subfolio-astro/...`), the domain `subfolio-astro.ilano.fyi`, the `base: '/subfolio-astro-docs/'` path, `package.json` `"name"`, or any backticked code span (`Subfolio.php`, `` `Filebrowser`/`Subfolio`/`Access` ``).
- NEVER change plain "Subfolio" where it refers to the original AREA17 PHP product or the `directory/` tree format. The full keep-list (13 mentions) is in the spec's "Explicitly kept as-is" section — treat it as authoritative.
- Only the 6 edits listed in these tasks are in scope. If any other occurrence looks wrong, stop and report — do not edit it.

---

### Task 1: Rebrand the docs landing page (`src/content/docs/docs/index.md`)

**Files:**
- Modify: `src/content/docs/docs/index.md:2` (frontmatter title)
- Modify: `src/content/docs/docs/index.md:6` (first body sentence)
- Modify: `src/content/docs/docs/index.md:16` (closing sentence)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks (Task 4 verifies the result via grep).

- [ ] **Step 1: Capture the baseline (the "failing test")**

Run:
```bash
grep -c 'Subfolio-Astro' src/content/docs/docs/index.md
```
Expected: `0` (grep exits 1 when the count is 0 — that is the expected "failing" state).

- [ ] **Step 2: Apply the three edits**

Use exact string replacement (e.g., the Edit tool). Old and new strings verbatim:

Edit 1 — line 2:
```
old: title: Subfolio Documentation
new: title: Subfolio-Astro Documentation
```

Edit 2 — line 6 (replace only the first word; the rest of the line stays byte-identical):
```
old: Subfolio turns a folder of files into a themeable website — no CMS, no database, no
new: Subfolio-Astro turns a folder of files into a themeable website — no CMS, no database, no
```

Edit 3 — line 16 (the link target in this line must NOT change):
```
old: New to Subfolio? Start with [Getting Started](/subfolio-astro-docs/docs/getting-started/).
new: New to Subfolio-Astro? Start with [Getting Started](/subfolio-astro-docs/docs/getting-started/).
```

- [ ] **Step 3: Verify the edits ("test passes")**

Run:
```bash
grep -c 'Subfolio-Astro' src/content/docs/docs/index.md
git diff -U0 -- src/content/docs/docs/index.md | grep '^[+-]' | grep -v '^[+-][+-]'
```
Expected: count is `3`, and the diff shows exactly 3 removed/3 added lines — lines 2, 6, and 16 — with the `](/subfolio-astro-docs/docs/getting-started/)` link target present and identical on both the `-` and `+` versions of line 16.

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/docs/index.md
git commit -m "docs(branding): use Subfolio-Astro on the docs landing page"
```

---

### Task 2: Rebrand the conventions index (`src/content/docs/docs/conventions/index.mdx`)

**Files:**
- Modify: `src/content/docs/docs/conventions/index.mdx:3` (frontmatter description)
- Modify: `src/content/docs/docs/conventions/index.mdx:6` (first body sentence)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks (Task 4 verifies the result via grep).

- [ ] **Step 1: Capture the baseline (the "failing test")**

Run:
```bash
grep -c 'Subfolio-Astro' src/content/docs/docs/conventions/index.mdx
```
Expected: `0` (grep exits 1 — expected "failing" state).

- [ ] **Step 2: Apply the two edits**

Edit 1 — line 3:
```
old: description: How Subfolio reads plain file and folder names as structure — the full naming-convention reference.
new: description: How Subfolio-Astro reads plain file and folder names as structure — the full naming-convention reference.
```

Edit 2 — line 6 (replace only the first word):
```
old: Subfolio has no CMS and no database. Every behavior — embedded text, popups, feature
new: Subfolio-Astro has no CMS and no database. Every behavior — embedded text, popups, feature
```

- [ ] **Step 3: Verify the edits ("test passes")**

Run:
```bash
grep -c 'Subfolio-Astro' src/content/docs/docs/conventions/index.mdx
git diff -U0 -- src/content/docs/docs/conventions/index.mdx | grep '^[+-]' | grep -v '^[+-][+-]'
```
Expected: count is `2`, and the diff shows exactly 2 removed/2 added lines (lines 3 and 6), no link targets touched.

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/docs/conventions/index.mdx
git commit -m "docs(branding): use Subfolio-Astro on the conventions index"
```

---

### Task 3: Rebrand the Starlight site title (`astro.config.mjs`)

**Files:**
- Modify: `astro.config.mjs:15` (Starlight `title` display string only)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks (Task 4 verifies the result via grep and build).

- [ ] **Step 1: Capture the baseline (the "failing test")**

Run:
```bash
grep -n "title: 'subfolio-astro-docs'" astro.config.mjs
```
Expected: one match on line 15.

- [ ] **Step 2: Apply the edit**

The `base: '/subfolio-astro-docs/'` on line 12 must NOT change — it is a URL path, not a display string.

```
old:       title: 'subfolio-astro-docs',
new:       title: 'Subfolio-Astro Docs',
```

- [ ] **Step 3: Verify the edit ("test passes")**

Run:
```bash
grep -n "Subfolio-Astro Docs" astro.config.mjs
grep -n "base: '/subfolio-astro-docs/'" astro.config.mjs
git diff -U0 -- astro.config.mjs | grep '^[+-]' | grep -v '^[+-][+-]'
```
Expected: title match on line 15; `base` still present and unchanged on line 12; diff shows exactly 1 removed/1 added line.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "docs(branding): Subfolio-Astro Docs as the Starlight site title"
```

---

### Task 4: Full-repo verification against the spec

**Files:**
- Modify: none (read-only verification; a failure here means a previous task must be fixed, not patched around).

**Interfaces:**
- Consumes: the committed results of Tasks 1–3.
- Produces: a pass/fail verdict for the whole pass.

- [ ] **Step 1: Inventory grep — correct spelling count**

Run:
```bash
grep -rc 'Subfolio-Astro' src/content/docs --include='*.md' --include='*.mdx' | grep -v ':0$'
```
Expected — exactly these three files and counts (6 content occurrences total: 3 + 2 + the pre-existing one in changes.md):
```
src/content/docs/docs/index.md:3
src/content/docs/docs/conventions/index.mdx:2
src/content/docs/docs/changes.md:1
```

- [ ] **Step 2: Keep-list spot check — original-product and format mentions unchanged**

Run:
```bash
grep -rn 'original Subfolio\|PHP Subfolio\|Subfolio `directory/`\|a Subfolio tree\|Subfolio install' src/content/docs --include='*.md' --include='*.mdx' | wc -l
```
Expected: `8` — the matching lines are changes.md:14, why-the-port.md:8, free-deploy.md:8, free-deploy.md:27, free-deploy.md:38, journey/index.mdx:24, getting-started.md:21, and folder-suffixes.mdx:24 (verified against the pre-edit tree). If the count differs, diff against the spec's keep-list line by line. Note this grep intentionally covers 8 of the spec's 13 keep-list mentions; the remaining 5 (journey/index.mdx:3 and :7 prose, and the 3 backticked code-identifier lines) are covered by the diff audit in Step 3, since no task touches those files.

- [ ] **Step 3: Link/URL audit — no technical token changed**

Run:
```bash
git diff main...HEAD -- src/content/docs astro.config.mjs | grep '^[+-]' | grep -v '^[+-][+-]' | grep -c 'subfolio-astro'
```
Expected: every diff line containing lowercase `subfolio-astro` has it only inside an unchanged link target/URL (line 16 of index.md and the config lines carry link/base strings through unmodified). Manually eyeball the output of the same command without `-c`: for each `-`/`+` pair, the lowercase `subfolio-astro` substrings must be identical between the two.

- [ ] **Step 4: Build**

Run:
```bash
npm run build
```
Expected: build completes with exit code 0 and no new warnings about broken links. Any link-related failure is a hard stop — it means a link target was touched; revert the offending edit and redo it.

- [ ] **Step 5: Final commit check**

Run:
```bash
git status --short
```
Expected: clean working tree (all edits committed in Tasks 1–3; this task commits nothing).
