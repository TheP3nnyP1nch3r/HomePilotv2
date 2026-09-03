# HomePilot

Sales page for HomePilot — flat-fee listing coaching ($1,994 total: $997 up front, $997 at closing).

## Contents

| File | What it is |
| --- | --- |
| `index.html` | Self-contained standalone build of the sales page. Open in any browser, works offline. |
| `HomePilot v5.4.dc.html` | Editable source for the sales page. |
| `HomePilot About.dc.html` | Editable source for the About page. |
| `support.js`, `image-slot.js` | Runtime scripts the `.dc.html` sources load. |
| `images/`, `uploads/`, `HomePilot-*` | Photos, logos, and icons referenced by the pages. |

## Viewing

- Quickest: open `index.html` directly.
- Editable sources: serve the folder over HTTP (`python3 -m http.server`), then open
  `HomePilot v5.4.dc.html`. They need `support.js` as a sibling file, so `file://` will not work.

## Deploying

`index.html` is fully inlined, so any static host works — GitHub Pages, Netlify, Cloudflare Pages.
For GitHub Pages: Settings → Pages → deploy from `main` / root.

## Regenerating index.html

`index.html` is a build artifact of `HomePilot v5.4.dc.html`. Edit the source, then rebuild the
standalone bundle rather than hand-editing `index.html`.
