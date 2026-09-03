# Automated publishing

Posts publish themselves **Tue / Thu / Sat at 14:00 UTC**. You fill a queue in batches; a
scheduled GitHub Action moves one post live each publish day and commits it. Cloudflare rebuilds
on that commit. No involvement from you between refills.

## Files

| File | Role |
| --- | --- |
| `queue.json` | Posts waiting to publish. You edit this. |
| `posts.json` | Published posts. The Action writes this — don't hand-edit. |
| `blog-config.json` | Image rotation list. |
| `.github/workflows/publish-post.yml` | The schedule. |
| `scripts/publish-post.js` | The publishing logic. |
| `TOPIC-ROTATION.md` | Which chapters have been used, and what's left. |

## Installing it

The five files go in the repo root, but **GitHub's drag-and-drop uploader silently skips
dotfolders**, so `.github/` will not upload that way. Create that one file through the web editor:

1. In the repo: **Add file → Create new file**
2. Type the filename as `.github/workflows/publish-post.yml` — typing the slashes creates the folders
3. Paste the contents, commit

Then drag `queue.json`, `blog-config.json`, and `scripts/publish-post.js` in normally (drag the
`scripts` folder itself to keep the path).

Finally, confirm the Action is allowed to commit: **Settings → Actions → General → Workflow
permissions → Read and write permissions.** Without this the job runs and fails at the push step.

## Adding posts to the queue

Append objects to the `posts` array in `queue.json`, using the same schema as `posts.json` (see
`ADDING-A-POST.md`), with two differences:

- **Omit `date`** — the Action stamps the real publish date.
- **Omit `readTime`** — it's calculated from word count. Include it to override.

Queue order is publish order: index 0 goes out next.

## Cover images

Covers alternate: **a photo, then a colored tile, then a photo.** That rhythm is set in
`queue.json` — each post either names a photo in its `image` field or leaves it `""`, which
renders the colored typographic tile using its `accent` and `kicker`. Keeping the alternation
means just following that pattern as you add posts.

Nine photos live in `images/blog/` at 1600×1000:

`cottage-autumn` · `craftsman-exterior` · `curb-appeal-street` · `bungalow-porch` ·
`blue-front-porch` · `staged-living-room` · `staged-bedroom` · `modern-kitchen` · `white-kitchen`

Match the photo to the topic — kitchens for cleaning and photography posts, exteriors for curb
appeal and pricing, interiors for staging. Reusing a photo across posts is fine once the queue
outgrows nine.

`blog-config.json` also supports an `imageRotation` pool that auto-assigns a photo to any post
with no `image` of its own. It's intentionally left empty, because an empty `image` is how you
ask for a colored tile. Only populate it if you decide you want photos on every post.

New photos: landscape, **1600×1000**, JPEG, into `images/blog/`.

## Running it manually

**Actions → Publish next journal post → Run workflow.** Useful for testing and for publishing
off-schedule.

## What it does when things go wrong

- **Queue empty** — the run succeeds, publishes nothing, and logs a warning. Nothing breaks; the
  site just stops getting new posts.
- **Queue at 3 or fewer** — logs a warning so you get a heads-up before it runs dry.
- **Duplicate slug or missing `slug`/`title`/`body`** — the run fails loudly and GitHub emails you.
  Nothing is published and nothing is committed.
- **Malformed JSON** — the run fails before touching `posts.json`.

Watch for the low-queue warnings. Three posts a week is about thirteen a month, so a batch of
twenty-five buys you roughly two months.
