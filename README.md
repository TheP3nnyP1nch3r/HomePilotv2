# HomePilot

Sales page for HomePilot — flat-fee listing coaching ($1,994 total: $997 up front, $997 at closing).

## Contents

| File | What it is |
| --- | --- |
| `index.html` | The deployable sales page. Loads `support.js` and the images from this repo, so it must be served over HTTP (not opened via `file://`). |
| `HomePilot v5.4.dc.html` | Editable source for the sales page. |
| `HomePilot About.dc.html` | Editable source for the About page. |
| `support.js`, `image-slot.js` | Runtime scripts the `.dc.html` sources load. |
| `images/`, `uploads/`, `HomePilot-*` | Photos, logos, and icons referenced by the pages. |

## Viewing

Serve the folder over HTTP, then open `index.html`:

    python3 -m http.server

The pages load `support.js` as a sibling file, so `file://` will not work.

## Deploying

Any static host works — GitHub Pages, Netlify, Cloudflare Pages.
For GitHub Pages: Settings → Pages → deploy from `main` / root.

## Editing

`index.html` is a copy of `HomePilot v5.4.dc.html`. Edit the v5.4 source, then copy it over
`index.html` — keep the two in step.
