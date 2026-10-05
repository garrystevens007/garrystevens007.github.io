# Garry Stevens: portfolio

A professional portfolio in an editorial, consulting-style layout: experience, case studies (Dompi first),
capabilities, credentials and contact. Live at https://garrystevens007.github.io/.

See [agents.md](agents.md) for the design rules, content architecture and decisions.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS, statically exported (`output: "export"`) and deployed to
GitHub Pages by GitHub Actions on every push to `main`.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

`npm run build` writes the static site to `out/` (a `postbuild` step fixes Next 16's RSC payload names, see
agents.md); `npm run lint`. Preview the export with `npx serve out`.

## Editing content

Everything on the site comes from `content/*.json`. Edit, commit, push; the site redeploys. To add a case study, see
"Adding a case study" in [agents.md](agents.md).
