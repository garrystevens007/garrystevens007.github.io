# Context

This repository (`garrystevens007.github.io`) is Garry Stevens's personal, **purely professional** portfolio: who he
is, where he has worked, and a handful of case studies told the way a consultant briefs a client. It is aimed at
readers from consulting firms (Deloitte, McKinsey, BCG) and hiring managers.

**Redesign of 2026-10-05.** The site used to be an admin-dashboard portfolio with a role picker (HR / Technical /
Manager), three role dashboards, a gamified API Playground and Recharts charts. The owner asked for a professional
site without roles; all of that was removed. Do not bring it back.

# Design

- **Editorial consulting look**: ivory paper, navy ink, one terracotta accent, generous white space, serif headings
  (Fraunces) over a sans body (Inter), large figures, thin rules between sections. Colours are tokens in
  [app/globals.css](app/globals.css) (RGB triplets, light under `:root`, dark under `.dark`) mapped in
  [tailwind.config.ts](tailwind.config.ts) as `paper`, `surface`, `ink`, `ink-2`, `muted`, `rule`, `accent`,
  `accent-soft`. Never hard-code a colour in a component when a token fits.
- **Case studies** follow Context → Approach → Impact, with a meta row (role, timeline, delivery, status) and,
  where there is a product, device mockups.
- **Kept from the old site (owner's choice):** the particle network (now subtle: navy, low density and alpha),
  the certification cards (image full-bleed under a dark frosted panel), and the dark mode toggle.
- **Dark mode** applies only when the visitor switches it on (stored in `localStorage.theme`); it never follows the
  OS setting alone. The inline script in `app/layout.tsx` sets the class before the first paint.

## Canvas performance rules (learned the hard way, don't regress these)

[components/site/ParticleBackground.tsx](components/site/ParticleBackground.tsx): never set `ctx.shadowBlur` inside a
loop (canvas shadows blur per draw call; it once cost dark mode half its frame rate). Lines are batched into a few
alpha buckets, one `stroke()` each. The canvas's CSS size and backing size are set separately, or the cursor lands
off its dot at fractional DPR. Reduced motion renders one static frame.

# Content Architecture

All content is JSON under [content/](content/); [lib/data.ts](lib/data.ts) imports it, validates it (typos in enum
values fail the build with a clear message) and derives what the pages use. To update the site: edit the JSON,
commit, push; GitHub Actions rebuilds and redeploys. Files can be edited on github.com directly.

```
content/
├── profile.json          name, title, summary, email, availability, areas of expertise, socials, resume URL
├── experience.json        roles, newest first (displayed in array order)
├── education.json
├── skills.json            categories and skill names (the site shows names only; `level`/`since` are used by the resume script)
├── certifications.json    cards in the Credentials section
├── cases.json             case studies, in display order; the first one is featured on the home page
└── site-meta.json         backendExperienceStartDate (drives the "N+ years" figure)
```

**Every figure on the site must be true.** The old `metrics.json` held invented numbers (bugs fixed, uptime, test
coverage) and was deleted. Numbers come from the CV or from measured facts (Dompi's from its repo and
`docs/v2/measurements.md`). If you cannot source a number, leave it out.

## Adding a case study

1. Add an entry to `content/cases.json` (`slug`, `title`, `headline`, `organisation`, `year`, `summary`, `role`,
   `timeline`, `tags`, `context[]`, `approach[]`, `impact[]`; optional `delivery`, `status`, `stats[]`, `hero`,
   `gallery[]`, `diagram`, `tryApp`, `footnote`).
2. Put images in `public/images/cases/<slug>/` as WebP: desktop shots 1920×1200, phone shots 780×1688.
3. The page `/cases/<slug>/` is generated at build time (`generateStaticParams`); nothing else to register.

## Dompi (case study 01)

The owner's own product (repo `finance-tracker-app`, private). Mockups are real screenshots of the app's UI running
on **invented English demo data**; the phone screens are the earlier phone companion, captioned "in development".
`tryApp: true` shows "I'd like to try Dompi": a `mailto:` with a ready message (`tryAppMailto` in `lib/data.ts`) and a
LinkedIn link; the owner grants access personally. Never link Dompi's source code.

**Present Dompi only as a private project in active development** (owner's decision, 2026-10-05): no Premium tier,
pricing, licences, admin console, beta programme or "Founder" title anywhere, including inside screenshots (the
mockup script hides the app's Premium menu). His employment contract restricts outside business activity without
written consent, so nothing here may read as a commercial venture.

# Employer confidentiality

The owner's employment contract has a confidentiality clause with no time limit. Never publish an employer's
internal details: security weaknesses, incidents, internal processes, customers or figures. Describe the work in
general terms ("strengthened credential handling and authentication components"), as the Experience bullets now do.
A case study about Unit4's credential storage was removed for this reason; do not add it back.

# Certifications

Rendered from source PDFs outside the repo by [scripts/render_certificates.py](scripts/render_certificates.py)
(first page → JPEG in `public/certificates/`). Only the four named items are published: Coursera Foundations of
Project Management, EF SET (B2), Certified Course-Net Coach, and the ACM publication. The diploma, transcript and
other certificates in that folder are **deliberately not included** (more personal detail than a course certificate);
the "All certifications on LinkedIn" link covers the rest. Cards with a `verifyUrl` link out; CCC has none.

# Privacy Decisions (explicit, don't silently reverse these)

- **No phone number** anywhere on the site or in the downloadable resume.
- The resume PDF is regenerated without the phone number by [scripts/build_resume.py](scripts/build_resume.py)
  (`pip install -r scripts/requirements.txt && python scripts/build_resume.py public/resume/Garry-Stevens-Resume.pdf`).
  The original PDF in `resource/` is gitignored and never published.

# Deployment

- Static export: `next.config.mjs` has `output: "export"`, `images.unoptimized` and `trailingSlash`.
  `npm run build` writes `out/`, then the `postbuild` script [scripts/flatten-rsc.mjs](scripts/flatten-rsc.mjs) copies
  Next 16's nested RSC payloads (`__next.cases/$d$slug/__PAGE__.txt`) to the flat names the client router requests
  (`__next.cases.$d$slug.__PAGE__.txt`). Without it every client navigation to a case study 404s and falls back to a
  full page load. Keep it until Next fixes the export.
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds on every push to `main` and deploys `out/` to
  GitHub Pages at `https://garrystevens007.github.io/`. **Pushing to `main` publishes the live site.**

## Local commands

`npm install`, `npm run dev` (http://localhost:3000), `npm run build` (writes `out/`), `npm run lint`. To preview the
export as Pages serves it: `npx serve out` (or `python -m http.server 3000` inside `out/`); `next start` does not work
with a static export.

# File Structure

```
/
├── app/
│   ├── layout.tsx            fonts, metadata, theme script, header, footer, particle background
│   ├── page.tsx              home: hero, at a glance, case studies, experience, capabilities, credentials, contact
│   ├── cases/[slug]/page.tsx case study pages (static params from content/cases.json)
│   ├── not-found.tsx         → out/404.html
│   ├── globals.css           colour tokens, light and dark
│   └── icon.svg
├── components/
│   ├── site/                 SiteHeader, SiteFooter, ThemeToggle, ParticleBackground
│   ├── cases/                Devices (laptop and phone frames), TryApp, Diagrams
│   ├── home/                 Credentials
│   ├── ui/                   SectionHeader
│   └── icons.tsx             GitHub/LinkedIn marks (lucide-react v1 has no brand icons)
├── content/                  EDIT HERE (see Content Architecture)
├── lib/data.ts               loads and validates content/*.json
├── public/
│   ├── images/cases/<slug>/  case study mockups (WebP)
│   ├── certificates/         rendered certificate images
│   └── resume/               phone-number-free resume PDF
├── scripts/                  flatten-rsc.mjs (postbuild), build_resume.py, render_certificates.py
└── resource/                 original resume PDF, gitignored
```

# Definition of Done (every change)

- `npm run build` and `npm run lint` pass.
- Checked in the browser on the exported site (`out/`), light and dark, desktop and phone width: no horizontal
  scroll, no console errors, no 404s.
- No invented figures; no phone number; no Dompi source links.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
