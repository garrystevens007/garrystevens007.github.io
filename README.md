# Garry Stevens — Portfolio Dashboard

Personal portfolio, built to look and behave like an admin **dashboard**
(Material Dashboard–style) instead of a traditional scrolling portfolio page — stat cards, an
interactive API Playground, and liquid-glass certification cards tell the story of experience,
skills, and credentials.

See [agents.md](agents.md) for the full spec, content decisions, and outstanding placeholders.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS + Recharts. Statically exported
(`output: "export"`) — no server required, deployable to GitHub Pages as-is (see
[agents.md](agents.md#deployment) for the details and the one open naming decision that affects
the final URL).

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

Other scripts: `npm run build` (produces `out/`), `npm run lint`. To preview the exported static
site the way a real host would serve it, run `npx serve out` — `npm run start` (`next start`)
doesn't work with a static export.

## Status

🚧 In progress — see the checklist in [agents.md](agents.md#definition-of-done). Notably: not yet
deployed anywhere, and a couple of content placeholders (real profile photo, self-rated skill
percentages) still open.
