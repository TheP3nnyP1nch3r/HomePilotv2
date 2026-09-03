# Upload this whole folder to the repo root

Everything here goes at the top level of `TheP3nnyP1nch3r/HomePilotv2`. Existing files with the
same name get replaced.

```
index.html            about.html            blog.html            post.html
posts.json            queue.json            blog-config.json
images/blog/          (24 cover photos)
scripts/publish-post.js
.github/workflows/publish-post.yml
AUTOMATION.md         TOPIC-ROTATION.md     ADDING-A-POST.md     UPLOAD-ME.md
```

## Two things the browser uploader can't do

**1. `.github/` won't drag and drop.** GitHub's web uploader silently skips folders starting with
a dot. Create that one file by hand: **Add file → Create new file**, type the path
`.github/workflows/publish-post.yml` (typing the slashes creates the folders), paste the contents
from this folder, commit.

Using GitHub Desktop or the command line instead? Then everything including `.github/` uploads
normally and you can skip this step.

**2. `index.html` is 3.6 MB** and has failed to upload here before. Drag it in on its own commit
so you can confirm it landed, then do the rest together.

## One setting to flip

**Settings → Actions → General → Workflow permissions → Read and write permissions.**

Without it the scheduled job runs, publishes correctly, then fails when it tries to commit.

## Then check

- Cloudflare rebuilds automatically on the commit
- `/blog.html` shows 6 posts with covers
- **Actions → Publish next journal post → Run workflow** publishes #7 immediately if you want to
  test it rather than waiting for Tuesday

## What's new in this upload

- 24 cover photos, up from 9 — a photo now repeats no sooner than ~22 posts (about 7 weeks),
  versus every 8 posts before
- Covers are randomized (about 28% colored tiles, never two tiles within 3 posts, no photo reused
  while a fresher one exists)
- Posting dates replace read times on tiles and post headers
- "Keep reading" cards show real covers instead of blank color blocks
- 12 queued posts, all 500+ words
