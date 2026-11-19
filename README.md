# gta6-cover-art-01-r4-slothana

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/slothanabot/gta6-cover-art-01-r4-slothana/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/slothanabot/gta6-cover-art-01-r4-slothana/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**Neon Grid Cover Studio** — turn any photo and a caption into GTA 6-style cover art: a neon-grid multi-panel poster with a Vice City sunset grade, bold outlined caption lettering, and one-click export to the common post sizes. It runs entirely offline in a desktop browser; photos never leave the machine.

## What it does

- **Multi-panel cover** — six-panel, four-panel, nine-panel grid, or a full-bleed solo layout, with white poster gutters and a tilted neon title band.
- **Any photo** — load a photo into any panel, crop it with zoom and pan sliders, or fill every panel with one photo. A built-in sample photo (painted in code) lets you try it with no upload.
- **Neon grades** — Sunset, Neon Night, Vice Pink, Teal Heat, and Mono Neon gradient grades, plus film grain and a vignette.
- **Caption lettering** — editable title, subtitle, and badge, drawn in bold outlined type with a neon glow.
- **Fast export** — one click exports a PNG at 1080 × 1080, 1080 × 1350, or 1920 × 1080.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080 in desktop Chrome. Load a photo, pick a layout and grade, write a caption, and hit **Export PNG**.

## Files

- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`.
- `app/index.html`, `app/style.css` — the editor page and its styling.
- `app/src/neon.js` — the cover rendering engine (layouts, grades, lettering, grain).
- `app/src/sample.js` — procedural sample photos, painted with canvas paths.
- `app/src/editor.js` — editor wiring, uploads, export, and screenshot modes.
- `screenshots/` — the app with a photo loaded, and covers it exported.

Original art and lettering throughout — no Rockstar Games logo, artwork, or font.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
