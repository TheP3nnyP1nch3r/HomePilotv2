#!/usr/bin/env node
/**
 * Publishes the next queued post.
 *
 * Moves queue.json's first entry into posts.json, stamps today's date, and picks a cover:
 * an explicit `image` on the queued post always wins; otherwise a cover is chosen from
 * blog-config.json's imageRotation, mixed with colored tiles so the grid never looks
 * mechanical. Exits 0 without changes when the queue is empty.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const QUEUE = path.join(ROOT, 'queue.json');
const POSTS = path.join(ROOT, 'posts.json');
const CONFIG = path.join(ROOT, 'blog-config.json');

const DEFAULT_ACCENTS = ['#E08A5F', '#2C2A28', '#6FA8DC', '#BC5730'];

const readJson = (p, fallback) => {
  if (!fs.existsSync(p)) {
    if (fallback !== undefined) return fallback;
    throw new Error('Missing file: ' + path.basename(p));
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    throw new Error(path.basename(p) + ' is not valid JSON: ' + e.message);
  }
};

const writeJson = (p, data) => fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/**
 * Chooses a cover for a post that didn't specify one.
 * Rules: never two tiles within `minGapBetweenTiles` posts; roughly `tileShare` of covers
 * are tiles; a photo is never reused while a fresher one is available.
 */
function chooseCover(published, config) {
  const rotation = (config.imageRotation || []).filter(Boolean);
  const tileShare = typeof config.tileShare === 'number' ? config.tileShare : 0.3;
  const minGap = typeof config.minGapBetweenTiles === 'number' ? config.minGapBetweenTiles : 2;
  const accents = (config.tileAccents || DEFAULT_ACCENTS).filter(Boolean);

  if (!rotation.length) return { image: '', accent: pick(accents) };

  const recent = published.slice(0, minGap);
  const tileTooSoon = recent.some(p => !(p.image || '').trim());

  if (!tileTooSoon && Math.random() < tileShare) {
    const lastTile = published.find(p => !(p.image || '').trim());
    const lastAccent = lastTile && lastTile.accent;
    const choices = accents.filter(a => a !== lastAccent);
    return { image: '', accent: pick(choices.length ? choices : accents) };
  }

  // Keep a photo out of circulation until nearly the whole pool has been used.
  const window = Math.max(1, Math.min(rotation.length - 3, 24));
  const recentlyUsed = new Set(
    published.slice(0, window).map(p => (p.image || '').trim()).filter(Boolean)
  );
  const available = rotation.filter(src => !recentlyUsed.has(src));
  return { image: pick(available.length ? available : rotation), accent: null };
}

function main() {
  const queue = readJson(QUEUE);
  const posts = readJson(POSTS);
  const config = readJson(CONFIG, {});

  const pending = Array.isArray(queue) ? queue : queue.posts || [];
  const published = Array.isArray(posts) ? posts : posts.posts || [];

  if (!pending.length) {
    console.log('::warning::Queue is empty — nothing published. Add entries to queue.json.');
    return;
  }

  const post = pending.shift();

  for (const field of ['slug', 'title', 'body']) {
    if (!post[field]) throw new Error('Queued post is missing required field: ' + field);
  }
  if (published.some(p => p.slug === post.slug)) {
    throw new Error('A post with slug "' + post.slug + '" is already published.');
  }

  post.date = new Date().toISOString().slice(0, 10);
  if (!post.kicker) post.kicker = 'HomePilot';
  delete post.readTime;

  const explicit = (post.image || '').trim();
  if (explicit) {
    post.image = explicit;
    if (!post.accent) post.accent = DEFAULT_ACCENTS[0];
    console.log('Cover: photo (specified in queue) — ' + explicit);
  } else {
    const cover = chooseCover(published, config);
    post.image = cover.image;
    if (cover.accent) post.accent = cover.accent;
    else if (!post.accent) post.accent = DEFAULT_ACCENTS[0];
    console.log(cover.image ? 'Cover: photo (rotation) — ' + cover.image
                            : 'Cover: colored tile — ' + post.accent);
  }

  published.unshift(post);

  writeJson(POSTS, Array.isArray(posts) ? published : { ...posts, posts: published });
  writeJson(QUEUE, Array.isArray(queue) ? pending : { ...queue, posts: pending });

  console.log('Published: ' + post.slug + ' (' + post.date + ')');
  console.log('Remaining in queue: ' + pending.length);
  if (pending.length === 0) console.log('::warning::Queue is now empty — refill queue.json.');
  else if (pending.length <= 3) console.log('::warning::Only ' + pending.length + ' post(s) left in the queue.');
}

try {
  main();
} catch (e) {
  console.error('::error::' + e.message);
  process.exit(1);
}
