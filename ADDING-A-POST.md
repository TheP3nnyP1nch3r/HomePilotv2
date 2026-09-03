# Publishing a post

You only ever edit **`posts.json`**. Nothing gets rebuilt, nothing gets recompiled. The blog page
reads it on load, and `post.html?slug=…` renders whichever entry matches.

## Add a post

Add an object to the top of the `posts` array:

```json
{
  "slug": "url-safe-name",
  "title": "The headline",
  "kicker": "Pricing",
  "excerpt": "One line, used for search results.",
  "readTime": "4 min read",
  "date": "2026-09-14",
  "image": "",
  "accent": "#E08A5F",
  "metaDescription": "140-160 characters for Google.",
  "body": [
    {"p": "A paragraph."},
    {"h": "A subheading"},
    {"pull": "A callout line, set large on a tinted panel."},
    {"list": ["First item", "Second item"]}
  ]
}
```

Its URL becomes `post.html?slug=url-safe-name`. Order in the file is the order tiles appear.

## Fields

| Field | Notes |
| --- | --- |
| `slug` | Must be unique. Lowercase, hyphens, no spaces. |
| `image` | Path to a real file, e.g. `images/comps.jpg`. Leave `""` and the tile renders a colored typographic card using `accent` + `kicker`. |
| `accent` | Hex color for the fallback card. Stay on palette: `#E08A5F`, `#2C2A28`, `#6FA8DC`, `#BC5730`. |
| `readTime` | Free text — shown verbatim on the tile. |
| `date` | `YYYY-MM-DD`. Formatted for display automatically. |
| `body` | Array of blocks. `p`, `h`, `pull`, `list` are the four types. A bare string is treated as `p`. |

## Body block types

- `{"p": "..."}` — paragraph
- `{"h": "..."}` — section heading
- `{"pull": "..."}` — emphasized callout on a tinted panel
- `{"list": ["...", "..."]}` — bulleted list

## Automating it

Any script that can append to a JSON array can publish. Read `posts.json`, unshift an object onto
`posts`, write it back, commit. No build step, no template rendering.

Keep it valid JSON — a trailing comma will silently empty the blog. The page shows a diagnostic
message if the file fails to parse or load.

## One requirement

These pages fetch `posts.json` at runtime, so they must be **served over HTTP** — a static host is
fine, but double-clicking `blog.html` from a folder will not work. Keep `posts.json` in the same
directory as `blog.html` and `post.html`.
