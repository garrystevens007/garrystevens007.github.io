# Context

This repository (`garry.github.io`) hosts a personal **portfolio website that looks and behaves
like an admin dashboard**, rather than a traditional "About / Projects / Contact" scrolling page.
Every "metric" and "panel" on the dashboard tells a professional story (experience, skills,
projects, code written, etc) instead of a real product's analytics.

Visual/UX reference: [Material Dashboard (Free) — Creative Tim](https://demos.creative-tim.com/material-dashboard-free/pages/dashboard.html)
— matched at the *layout language* level (fixed sidebar, top navbar, card grid, soft shadows,
rounded corners, muted background, accent colors), not literal content.

**Color palette is an exact match**, pulled directly from that demo's own theme CSS
(`assets/css/material-dashboard.min.css` v3.2.0), not eyeballed — see the `colors`/`boxShadow`
block in [tailwind.config.ts](tailwind.config.ts) for the sourced values (primary `#e91e63`,
info/success/warning/danger gradients, etc.), and `bg-neutral-*` throughout for the page/card
surfaces (`--bs-gray-100` = `#f5f5f5` is Tailwind's stock `neutral-100`, not a custom token). Stat
cards and the active sidebar link use per-accent gradients (primary/info/success/warning), not a
single uniform tile — this was a deliberate later change from the reference demo's own (more
monochrome) default, made when asked to make the dashboard "more colorful." If Creative Tim ever
revs that theme, re-pull the same CSS file and diff the `--bs-*` custom properties before touching
this palette by hand.

**Exception**: the API Playground section (see below) deliberately does **not** follow this
palette — it uses its own standalone color system per `agentsmd/DESIGN_SPECS.md`, on purpose, to
read as a distinct sub-app bolted onto the dashboard.

# Tech Stack

- **Next.js 16 (App Router) + TypeScript** — chosen over the original plain-HTML/Bootstrap plan
  specifically so a future "showcase my projects via API" feature (e.g. pulling public repos from
  the GitHub REST API, or a WakaTime-style lines-of-code tracker) has somewhere to live, without a
  rewrite. React Server Components keep most sections server-rendered by default.
- **Tailwind CSS** for styling — utility classes keep component files self-contained (no separate
  stylesheet to keep in sync), and it's a compact, predictable format to generate/maintain.
- **Recharts** for the dashboard charts (skills proficiency, tenure-per-role).
- **lucide-react** for iconography, plus two hand-rolled inline SVGs
  ([components/icons.tsx](components/icons.tsx)) for the GitHub/LinkedIn brand marks, since
  lucide-react v1 dropped brand/logo glyphs entirely.
- **GitHub Pages** for hosting/deployment (`output: "export"` static build) — see Deployment below;
  this bullet used to say Vercel/"not GitHub Pages" and that's no longer accurate, see the
  Deployment section's own note on why.
- **Editable content lives in `content/*.json`** (profile, experience, education, skills,
  certifications, site-meta) — see [Content Architecture](#content-architecture) below.
  [lib/data.ts](lib/data.ts) imports that JSON, validates it, and derives everything components
  actually import; component files still render via `lib/data.ts` exactly as before and don't
  hardcode copy. Stat-card numbers (years of experience, tech count, cert count) are *computed*
  from that same content, not duplicated by hand.

# Content Architecture

**To update real content** (a new job, a new cert, a skill re-rated): edit the relevant file under
[content/](content/), commit, push — the existing GitHub Actions workflow rebuilds and redeploys
automatically. Files can be edited directly on github.com (click file → pencil icon → edit →
commit) — no local dev setup needed for a quick text change.

```
content/
├── profile.json         # name, title, bio, socials, resume URL, areas of expertise, languages
├── education.json       # single object: degree, school, location, period
├── experience.json       # array of roles, newest-should-be-first (displayed in array order)
├── skills.json            # array of {category, accent, skills:[{name, level}]}
├── certifications.json    # array of certs/publications — see Certifications below for scope
└── site-meta.json          # the ONLY two purely-manual facts: backendExperienceStartDate, linesOfCodeWritten
```

**Design decisions worth knowing before changing this**:
- **Split by domain, not one big file or dozens of tiny ones.** A single mega-JSON makes a future
  "added one job" diff hard to review; one file per topic keeps each edit small and obvious to spot
  in a PR/commit.
- **`lib/data.ts` is a thin derivation layer, not a copy.** It imports each JSON file, type-checks
  it against an interface, and derives every export components already use (same names, same
  shapes) — so this refactor required zero changes to any component file. Verified, not assumed:
  re-ran the full Playwright content-parity pass after the refactor, 17/17 checks, 0 console errors
  — every value (stat card numbers, role names, skill levels, cert links) still resolves exactly as
  before, just sourced from JSON now instead of inline TS literals.
- **JSON imports do NOT get automatic literal-type narrowing.** A field like `"accent": "primary"`
  in JSON types as plain `string` on import, not the `Accent` union — TypeScript will *not* catch
  `"accent": "purpel"` on its own the way it would for the same value written directly in a `.ts`
  file. `lib/data.ts` has small `assertAccent`/`assertCertKind` runtime checks specifically to cover
  this gap — confirmed for real by deliberately typo-ing `content/skills.json` and rebuilding: it
  fails `npm run build` with `Invalid accent "purpel" in content/skills.json category "Languages" —
  must be one of: primary, info, success, warning, danger`, not a cryptic downstream crash. Don't
  remove these checks under the assumption TypeScript alone already covers it — it doesn't.
- **The API Playground's mock endpoint/preset data stays in TypeScript, deliberately not moved to
  JSON** — it's tightly coupled to the typed `resolveMockResponse` logic keyed off specific
  endpoint ids (see the API Playground section below), not "CV content" someone would hand-edit.
  Moving it would lose that type safety for no real benefit.
- **Why not an API or an upload endpoint instead of git?** This is a static export with no server
  (see Deployment) — an API to accept content updates would mean standing a server back up just to
  write files, undoing the reason it's static in the first place. Git + the existing CI is simpler,
  free, and (via GitHub's web editor) doesn't actually require a local dev environment either.
- **`scripts/build_resume.py` reads the same `content/*.json`** (profile, education, experience,
  skills) instead of a separate hand-typed copy — editing `experience.json` and re-running that
  script keeps the downloadable resume in sync with the website automatically. Two small, deliberate
  wording differences from the original uploaded resume, both because the JSON schema doesn't carry
  this level of freeform detail: job/education date ranges now render with "—" everywhere (the
  original resume PDF used the word "to"; the website already used "—" — picked one for both
  rather than keep two parallel `period`-like fields for a purely stylistic difference), and the
  "Technical Proficiencies" line lists skill names without the original's parenthetical
  years-of-experience notes (e.g. "Java EE (3+ years)") since `skills.json` only tracks a 0–100
  `level`, not free text like that. Regenerated and re-verified (build/lint clean, phone number
  confirmed absent from the output bytes, content spot-checked) after this change.

# Site Structure

Single dashboard page ([app/page.tsx](app/page.tsx)) — a fixed sidebar + sticky navbar shell
([components/layout/DashboardShell.tsx](components/layout/DashboardShell.tsx)) wrapping stacked
sections, each with an anchor id the sidebar scrolls to (with scroll-spy active-link highlighting
via `IntersectionObserver`):

1. **Overview** — stat cards, then the **API Playground** (own anchor, own sidebar entry — see
   below), then two charts.
2. **About Me** — profile card, bio, education, resume download button.
3. **Experience** — work history, newest first, real dates from the resume.
4. **Skills** — grouped by category with proficiency bars.
5. **Certifications** — "liquid glass" cards (real certificate image full-bleed + frosted overlay
   panel) for a curated set of real certs + one publication — see below. Replaced the original
   placeholder Projects section entirely (sidebar entry, anchor id, and stat card all renamed).
6. **Contact** — email + LinkedIn + location + GitHub. Phone number intentionally omitted (see
   Privacy Decisions). LinkedIn now points to the real profile (`linkedin.com/in/garstev`).

Top navbar shows the active section name and a light/dark theme toggle (persisted via
`localStorage`, no-flash inline script in [app/layout.tsx](app/layout.tsx)).

# Requirements — status

## 1. Stat cards ✅

Four cards, values computed from `lib/data.ts`, not hand-typed:

- **"30,000+ Lines of Code Written"** — static, manually-updated figure (no LOC tracker wired up).
- **"4+ Years of Experience"** — computed from `content/site-meta.json`'s
  `backendExperienceStartDate` (Feb 2022, Samsung Research start) to the current date, so it stays
  accurate without ever needing a manual bump — redeploying refreshes it automatically. This
  originally computed from Feb 2019 (the Course-Net Academy Instructor start), giving "7+" — but
  that didn't match the resume's own framing ("Backend Engineer with 4+ years of experience..."),
  which counts only the backend-engineering roles (Samsung + Unit4), not the earlier instructor
  role. Changed to match, on request, since the mismatch between the live site and the downloadable
  resume was the actual problem — not the specific number. The instructor years are still shown in
  full in the Experience section and the tenure chart; they're just excluded from this one
  headline figure, same as the resume itself does.
- **"18+ Technologies & Tools"** — `Object.values(skills).length` across all categories.
- **"4 Certifications Earned"** — `certifications.length` (3 certs + 1 publication).

## 2. Charts ✅

- **Top Skills** — horizontal bar chart of the 8 highest self-rated skills.
- **Tenure per Role** — bar chart of real years-per-role, computed from each role's actual
  start/end dates (not fabricated placeholder data).

## 3–7. About / Experience / Skills / Certifications / Contact ✅ (real content, not placeholders)

See [lib/data.ts](lib/data.ts) for the actual copy. Known gaps are listed below.

## 8. Cross-cutting ✅

- Responsive: sidebar collapses to an off-canvas panel below `lg`.
- Light/dark toggle via `useSyncExternalStore` over the `<html>` element's class — hydration-safe,
  no flash-of-wrong-theme.
- Semantic landmarks, `aria-label`s on icon-only controls, keyboard-reachable nav.
- No unused libraries; charts and icons are the only non-framework runtime deps.
- `<title>`, meta description, Open Graph tags set in `app/layout.tsx`; favicon via
  `app/icon.svg` (Next.js metadata file convention).
- **Particle network background** ([components/layout/ParticleBackground.tsx](components/layout/ParticleBackground.tsx))
  — a fixed full-page `<canvas>` (`-z-10`, `pointer-events-none`) behind everything, rendered from
  `DashboardShell`. Only visible in the negative space around the opaque sidebar/navbar/cards (and
  through the navbar's own `backdrop-blur`, which picks up a frosted glimpse of it). Color is the
  exact `info` gradient's lighter stop (`#49a3f1`) already in `tailwind.config.ts` — same sourced
  palette, just a new use of it, not a new color pick. Dots connect with lines by proximity
  (classic constellation network) and to the cursor, with gentle cursor repulsion.
  - **Cursor connects to its N nearest particles (always 6), not "whatever's within a fixed
    radius"** — a pure-radius approach could mean zero connections in sparser areas, which reads as
    "hovering does nothing." Nearest-neighbor selection (capped at 260px so it never draws across
    an empty screen) guarantees the effect is visible anywhere. The cursor itself also draws as a
    small glowing node, on top of everything else, so hovering clearly reads as "joining the
    network" rather than a couple of faint incidental lines.
  - **Theme-aware without duplicating color logic**: draws with `ctx.clearRect` (fully transparent)
    each frame rather than filling a background — the already-theme-aware `body` color from
    `globals.css` shows through untouched. Only *intensity* (opacity/glow) differs between themes,
    watched live via a `MutationObserver` on `<html>`'s `class` attribute so toggling doesn't
    require a reload.
  - **Respects `prefers-reduced-motion`**: renders one static frame, no animation loop, no cursor
    interaction — per the OS setting, not just visually thinned out.
  - **Pauses on `visibilitychange`** (backgrounded tab) and is capped at `devicePixelRatio` 2, so it
    doesn't burn battery/CPU when not visible or on very high-DPI screens.
  - Particle count scales with viewport area, clamped 90–360 (bumped twice on request for more
    density — was 28–110, then 70–260 — so if asked again, check whether the divisor in
    `particleCountFor` needs lowering further rather than assuming it's already maxed out).
  - **Ambient drift never decays** — each particle has a constant `baseVx/baseVy` plus a separate
    `impulseVx/impulseVy` that only cursor-repulsion writes to and that decays via drag. An earlier
    version applied the same drag to the base velocity every frame, which exponentially decayed
    *all* motion to a standstill within a few seconds regardless of the animation loop still
    running — reported as "it keeps stopping." If the network ever looks like it settles again,
    check this split hasn't been collapsed back into one velocity.
  - **`canvas.style.width`/`height` are set explicitly in `resize()`, separately from the
    `canvas.width`/`height` attributes** — do not remove these two lines. A `<canvas>` is a
    replaced element with an intrinsic size equal to its width/height *attributes*; per the CSS
    spec, that intrinsic size overrides `inset-0`'s stretch-to-fill behavior for a replaced element
    with no explicit CSS width/height (a plain `<div>` would stretch fine without this — canvas
    won't). Without pinning the CSS size separately, the canvas's on-screen box silently becomes
    `width*dpr × height*dpr` CSS pixels instead of the actual viewport size — e.g. 2160×1350 instead
    of 1440×900 at 1.5x display scaling — while the rest of this file's math still assumes
    `window.innerWidth/innerHeight`. That mismatch was the cause of a real reported bug ("the dot
    isn't on the pointer"): confirmed via `getBoundingClientRect()` showing the inflated box, and
    the cursor node landing ~350px off at 1.5x scaling. It was invisible at exactly 1x DPR (device
    pixel ratio) because `width*1 === width`, coincidentally masking the bug — always test canvas
    coordinate math at a fractional DPR (1.5x, not just 1x or 2x) before trusting it.
  - Verified via Playwright: canvas actually draws non-transparent pixels (not just present in the
    DOM), sidebar clicks still work through it (`pointer-events-none` confirmed, not just assumed),
    0 console errors — 5/5 checks. Screenshotted in both themes before calling it done.

# API Playground

A Postman/Swagger-style interactive mock API explorer, built from the spec in
[agentsmd/](agentsmd/) (`API_PLAYGROUND_OVERVIEW.md`, `DATA_STRUCTURE.md`, `ENDPOINTS_DEFINITION.md`,
`DESIGN_SPECS.md`, `UI_COMPONENTS.md`, `IMPLEMENTATION_GUIDE.md` — kept as the source spec; read
those for the full original design intent). Lives inside Overview, between the stat cards and the
charts, with its own sidebar entry and scroll anchor (`#api-playground`).

**All 14 endpoints are mocked/hardcoded** — there is no real backend. Code: `lib/data.ts`
(types, endpoint/preset data, and the response-resolution logic) + `components/api-playground/*`
(15 components, container is `ApiPlayground.tsx`).

**Deliberately distinct visual style**: per explicit direction, this section uses the spec's own
standalone palette (pink `#ec4899`, `gray-50/900`, method-colored badges) rather than the site's
real sourced Material Dashboard palette, and has no `dark:` variants — it stays light regardless of
the site's theme toggle, reading as a bolted-on sub-app rather than blending in. Don't
"fix" this into matching the rest of the site without asking first.

**Bugs found and fixed while implementing** (the spec docs had a few internal inconsistencies —
noting them here so a future pass doesn't reintroduce them):
- `handleLoadPreset`'s example code did `getEndpointById(preset.id)`, but preset ids (`"preset-cv"`)
  never match endpoint ids (`"get-cv"`) — presets could never have actually loaded anything. Fixed
  via `findEndpointByMethodPath`, which matches on method + resolved path instead (and extracts
  `{pathParam}` values from a concrete path like `/api/experience/roles/unit4`).
- `validateRequestBody`'s schema check compared `typeof value` against the literal string
  `"array"`, which `typeof` can never produce (arrays are `"object"`) — the array branch was dead
  code. Fixed with an explicit `Array.isArray` check.
- `GET /api/projects`'s example response claimed `"count": 3` but only listed 2 projects — fixed by
  adding a genuine third (drawn from the real Course-Net instructor role, not invented).
- `RequestBuilder`'s example UI showed a 4-button method switcher (GET/POST/PUT/DELETE) even though
  each `Endpoint` has exactly one fixed `.method` — replaced with a read-only method badge, since a
  switcher could produce a method/endpoint combination that doesn't exist in the data.
- The spec's `simulateApiCall` picked success/error by flat 90/10 random chance regardless of what
  was typed, and never actually called the already-defined `validateRequestBody` — meaning typing a
  bad company name or an invalid contact form had only a 10% chance of ever showing the error state.
  Replaced with `resolveMockResponse`, which reacts to real input: an unknown `company` path param
  genuinely 404s, an invalid email/short message on the contact form genuinely 400s, and
  `GET /api/search` returns its "no results" variant unless the query contains a known term. Only
  these three endpoints branch on input; everything else returns its one defined response
  deterministically (most endpoints only have a 200 defined in the first place).
- `localStorage`-persisted history/stats: reading them in a mount `useEffect` (as the guide's own
  example does) is a real hydration-mismatch risk, not just a lint nag — the server and first
  client render would both show empty state, then suddenly show real content once the effect runs,
  which for `RequestHistory` flips from rendering nothing to rendering a list. Fixed with a small
  reusable `useSyncExternalStore`-backed store ([lib/local-storage-store.ts](lib/local-storage-store.ts)),
  same pattern as [components/layout/ThemeToggle.tsx](components/layout/ThemeToggle.tsx).

**Verified**, not just built: `npm run build` + `eslint .` clean, plus a full Playwright
click-through (preset loading, the three input-sensitive endpoints above, copy-to-clipboard,
history/clear, sidebar nav) — 19/19 checks passed, 0 console errors.

**Not implemented** (the spec's own "Optional Enhancements" section — skip unless asked):
code export (curl/JS/Python), a share-response link, list virtualization, an error boundary
wrapper, and dark-mode support for this section specifically.

**Contact endpoint has a real side effect on success**: `POST /api/profile/contact` is still a
mocked response, but a genuinely-valid submission (passes the same validation the mock uses) also
shows a real `mailto:stevens.garrys@gmail.com` link — built with `buildContactMailto()` in
`lib/data.ts` — pre-filled with the visitor's typed subject/message/name, plus a secondary "connect
on LinkedIn" link. Uses plain `encodeURIComponent`, not `URLSearchParams` — mailto URIs percent-
encode spaces per RFC 6068, they don't use `+` the way a query string does.

**On performance**: the History/Stats `localStorage` persistence (above) is not a production
concern — history is hard-capped at 5 entries, stats is one small flat object, both are plain
synchronous reads/writes of a few KB with no network round-trip, and nothing here calls a real API
or a cache. There's no lag to worry about at this scale.

# Certifications

Real, curated content — not all of it though. Rendered from source PDFs in
`E:\Project kaya\Certificate`, but **only the 3 explicitly named + the ACM publication** made it
in: Coursera ("Foundations of Project Management", Aug 2025), EF SET English Certificate (B2, 
60/100, Feb 2026), and Sertifikat CCC ("Certified Course-Net Coach", Jul 2021) — plus the ACM DOI
publication. That folder also has a diploma (`Ijazah.jpeg`), a full grade transcript, and a couple
other certs — **deliberately not included**: a diploma/transcript carries more personal detail
(student IDs, birthdate-adjacent info) than a course certificate is meant to expose publicly, and
nothing beyond the four named items was asked for. Don't add the rest of that folder without
asking first — the "for other certifications see LinkedIn" line in the section is intentional, not
a gap to fill from local files.

- **Images**: [scripts/render_certificates.py](scripts/render_certificates.py) rasterizes each
  cert PDF's first page to a JPEG in `public/certificates/` (PyMuPDF, `pip install pymupdf`) — the
  source PDFs themselves are never committed, only the rendered images. The ACM publication has no
  certificate image (it's a paper, not a cert) — its card uses a gradient instead.
- **"Liquid glass" card design** (explicit direction, confirmed before building): each card shows
  the real certificate image full-bleed via `next/image` with `fill`, a dark-tinted
  (`bg-black/35 backdrop-blur-lg`) frosted panel overlaid at the bottom for the title/issuer/date,
  and the cert's accent color glowing from a corner (blurred, bleeds through the glass). The panel
  is dark-tinted deliberately — an earlier white-tinted attempt (`bg-white/10`) put white text
  directly over a real certificate's own often-white background with nothing to guarantee
  contrast, which was unreadable; a dark tint (like iOS's own Liquid Glass over a bright wallpaper)
  guarantees legibility regardless of what's behind it, confirmed via an actual screenshot, not
  assumed. Cards render identically in light/dark site theme by design (no `dark:` variants needed
  — they're photo-based, not surface-based).
- Cards with a `verifyUrl` are clickable (link out, new tab); CCC has no public verification URL
  and is correctly left non-interactive rather than linking somewhere fake.
- **LinkedIn**: `socials.linkedin` now points to the real profile
  (`https://www.linkedin.com/in/garstev`) — this was a long-standing placeholder (`"#"`), resolved
  because the user shared it while asking for this feature. The section header also links to
  `linkedinCertificationsUrl` (the certifications tab specifically) for "view the rest."
- Verified with Playwright: all 4 cards render, real verify links work, CCC correctly isn't a
  link, LinkedIn links resolve — 14/14 checks, 0 console errors.

# Privacy Decisions (explicit, don't silently reverse these)

- **Phone number**: present in the source resume, deliberately **excluded** from the public site
  (Contact section shows email + LinkedIn + location only) — and from the downloadable resume too.
- **Resume PDF download**: the original resume PDF (`E:\CV\ATS_Garry_Stevens.pdf`, same as
  `resource/`) has the phone number embedded in it, so it's never published directly. Instead,
  [scripts/build_resume.py](scripts/build_resume.py) regenerates a clean PDF from the resume's own
  text with the phone number genuinely omitted (not just visually covered — true redaction, since
  a copy-covering approach would leave the number extractable underneath). That output lives at
  `public/resume/Garry-Stevens-Resume.pdf` and is what the About section's Download Resume button
  links to. `resource/` (holding the original, unredacted PDF) stays `.gitignore`d.
- To regenerate after a content change: edit the text in `scripts/build_resume.py`, then
  `pip install -r scripts/requirements.txt && python scripts/build_resume.py public/resume/Garry-Stevens-Resume.pdf`.

# Known Placeholders / TODOs

- [x] **LinkedIn URL** — resolved, see Certifications above.
- [x] **Resume PDF** — see Privacy Decisions above.
- [x] **Projects placeholders** — replaced by real Certifications content (see above); the GitHub
      API idea (`https://api.github.com/users/garrystevens007/repos`) is still open if real
      projects/repos get added as their own thing later.
- [ ] **Real profile photo** — currently a "GS" initials avatar (no image asset needed/used).
- [ ] Skill proficiency percentages in `lib/data.ts` are self-rated placeholders — adjust freely.

# Deployment

**Correction to this file's own earlier position**: this originally said "Not GitHub Pages" on the
theory that a future API-driven feature might need a Node server. That never ended up true — the
API Playground is entirely mocked/client-side (see above), there are no `app/api/*` routes,
no middleware, no ISR, nothing under `next/headers` — so there's nothing in this codebase that
actually requires a server. Verified by actually building with `output: "export"` and serving the
result as plain static files (no Next process behind it at all): full Playwright pass, 9/9 checks,
0 console/network errors — nav, the API Playground, the particle canvas, cert images, dark mode,
and the resume link all work identically. **GitHub Pages is viable for this app as it stands.**

## GitHub Pages (current setup)

- `next.config.mjs` has `output: "export"` and `images: { unoptimized: true }` — required because
  Pages has no server to run Next's Image Optimization endpoint against. `npm run build` now
  produces a plain `out/` folder (`index.html`, `_next/`, all `public/` assets, a `404.html`) —
  exactly what Pages serves.
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds on every push to `main` and
  deploys `out/` via `actions/deploy-pages` — the standard Next.js-on-Pages recipe. Requires a
  one-time manual toggle in the repo's own settings (Settings → Pages → Build and deployment →
  Source → **GitHub Actions**) — not something crackable via `git push` alone, and not yet done as
  of writing.
- **Repo name vs. account name matters for the final URL.** This repo is
  `garrystevens007/garry.github.io` — but a GitHub *user* site (served at the clean root
  `https://garrystevens007.github.io/`) requires the repo to be named *exactly*
  `<account>.github.io`. Since the account is `garrystevens007` and the repo is `garry.github.io`,
  they don't match, so as-is this deploys as a *project* site instead, at
  `https://garrystevens007.github.io/garry.github.io/` — one path segment deeper, and additionally
  requiring `basePath: "/garry.github.io"` (and matching `assetPrefix`) in `next.config.mjs` for
  every internal link/asset path to resolve under that subpath. The clean alternative is renaming
  the repo itself to `garrystevens007.github.io` (a GitHub Settings → General → repository name
  action) and dropping `basePath` entirely. **This decision was left to the account owner —
  don't assume either path was chosen without checking the actual repo name and next.config.mjs
  first.**
- If real projects/certs/etc. are ever fetched from a real third-party API at runtime requiring a
  secret key, *that* would be the point Pages stops being sufficient (no server to hide a secret
  behind) — Vercel remains the fallback for that case, see below.

## Vercel (alternative / fallback)

- Sign in at vercel.com with the GitHub account, import this repo, accept the detected Next.js
  defaults. Every push to `main` then auto-deploys. One-time manual step (needs the account
  owner's login) — not something that can be scripted from here. Keeps full Next.js server
  features (not that this app currently uses any) if they're ever needed later.

## Local commands

`npm install`, `npm run dev` (localhost:3000), `npm run build` (now produces `out/` per the export
config above) + `npm run start` — note `next start` does **not** work against an `output: "export"`
build the normal way; to preview the exported static site locally, serve `out/` directly instead
(e.g. `npx serve out`). `npm run lint`.

# File Structure

```
/
├── app/
│   ├── layout.tsx       # fonts, metadata, no-flash theme script
│   ├── page.tsx          # composes DashboardShell + all sections
│   ├── globals.css
│   └── icon.svg           # favicon (Next.js metadata file convention)
├── components/
│   ├── layout/            # DashboardShell, Sidebar, Navbar, ThemeToggle, ParticleBackground
│   ├── dashboard/         # SectionHeading, StatCard, SkillsChart, TenureChart
│   ├── sections/          # Overview, About, Experience, Skills, Certifications, Contact
│   ├── api-playground/    # ApiPlayground + 14 sub-components (Postman-style mock API explorer)
│   └── icons.tsx           # GitHub/LinkedIn brand SVGs (lucide-react v1 dropped these)
├── content/                  # EDIT HERE for real content — see Content Architecture above
│   ├── profile.json
│   ├── education.json
│   ├── experience.json
│   ├── skills.json
│   ├── certifications.json
│   └── site-meta.json
├── lib/
│   ├── data.ts               # imports content/*.json, validates it, derives every UI export
│   └── local-storage-store.ts # useSyncExternalStore-backed localStorage helper
├── public/
│   ├── resume/             # regenerated, phone-number-free resume PDF (the actual download)
│   └── certificates/       # rendered cert images (see scripts/render_certificates.py)
├── scripts/
│   ├── build_resume.py         # regenerates public/resume/*.pdf from content/*.json (see requirements.txt)
│   ├── render_certificates.py  # rasterizes cert PDFs (from outside the repo) into public/certificates/
│   └── requirements.txt
├── agentsmd/                # source spec for the API Playground feature — kept for reference
├── resource/                # ORIGINAL RESUME PDF — gitignored, never pushed (has phone number)
├── README.md
└── agents.md                 # this spec
```

# Definition of Done

- [x] Dashboard shell (sidebar + navbar + card grid) matching the Material Dashboard layout language.
- [x] All four stat cards render with computed (not hardcoded-twice) figures.
- [x] Skills chart + tenure chart render via Recharts.
- [x] About, Experience, Skills, Certifications, Contact populated with real content (placeholders
      only where explicitly noted above).
- [x] Responsive down to mobile width; sidebar collapses correctly.
- [x] Light/dark toggle works, hydration-safe, persists via `localStorage`.
- [x] `npm run build` and `npm run lint` both pass clean; smoke-tested via `npm run start`.
- [x] API Playground: all 14 mock endpoints, presets, history, stats, and error scenarios working
      and Playwright-verified (19/19 checks, 0 console errors).
- [x] Certifications: 4 real cards, verify links, LinkedIn CTA — Playwright-verified (14/14 checks,
      0 console errors).
- [x] Particle network background: renders, click-through works, reduced-motion respected,
      density increased twice, confirmed to keep moving indefinitely (canvas checksummed at three
      points ~5.5s apart, still changing at each), and cursor reliably connects to its nearest
      nodes anywhere on screen (verified by sampling canvas alpha exactly at the pointer before vs.
      after moving there) — Playwright-verified throughout, including a fractional-DPR (1.5x)
      coordinate-accuracy check after fixing the CSS-vs-attribute canvas sizing bug above.
- [x] Repo renamed to `garrystevens007.github.io` (clean root URL), local git remote updated,
      rename verified via `git ls-remote` against the new URL rather than assumed.
- [x] Static export (`output: "export"`) verified end-to-end: built, served as plain static files
      with zero Next.js process behind it, full Playwright pass (9/9 checks, 0 errors) — nav, API
      Playground, particle canvas, cert images, dark mode, resume link all work identically.
      `.github/workflows/deploy.yml` ready to auto-deploy on push to `main`.
- [x] All editable content (profile, experience, education, skills, certifications) moved to
      `content/*.json`, `lib/data.ts` reduced to a validated derivation layer, zero component
      changes needed — re-verified full content parity post-refactor (17/17 checks, 0 errors) and
      confirmed the build-time validation actually fires on a real typo (not just assumed).
      `scripts/build_resume.py` now reads the same JSON instead of a separate hand-typed copy.
- [ ] Not yet done: push to GitHub and flip the repo's Settings → Pages → Source → GitHub Actions
      toggle (see Deployment) — the account owner's manual step, not scriptable from here.
- [ ] Placeholders above filled in with real content.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
