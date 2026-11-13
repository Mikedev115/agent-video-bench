#!/usr/bin/env node
/* Builds prompts/index.json from the front matter of every prompts/<track>/*.md file.
   Usage: node scripts/build-index.mjs          (write the index)
          node scripts/build-index.mjs --check  (validate only, fail if the index is stale) */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const promptsDir = join(root, 'prompts');
const outFile = join(promptsDir, 'index.json');
const checkOnly = process.argv.includes('--check');

const TRACKS = ['mechanics', 'rigid-body', 'soft-and-fluid', 'shader', 'world', 'architecture', 'rig', 'audio'];
const REQUIRED = [
  'id', 'slug', 'track', 'source',
  'title_th', 'title_en', 'measures_th', 'measures_en',
  'tags', 'output', 'duration', 'fps', 'resolution',
  'check_th', 'check_en'
];

const problems = [];
const fail = (msg) => problems.push(msg);

function unquote(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseFrontMatter(text, file) {
  const lines = text.split(/\r?\n/);
  if ((lines[0] || '').trim() !== '---') {
    fail(`${file}: ต้องเริ่มไฟล์ด้วย front matter (บรรทัดแรกเป็น ---)`);
    return null;
  }
  const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (end < 0) {
    fail(`${file}: front matter ไม่มีบรรทัดปิด ---`);
    return null;
  }
  const meta = {};
  let key = null;
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item) {
      if (!key) {
        fail(`${file}:${i + 1}: รายการ - อยู่ก่อนชื่อ key`);
        continue;
      }
      if (!Array.isArray(meta[key])) meta[key] = [];
      meta[key].push(unquote(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z][\w-]*):\s?(.*)$/);
    if (!kv) {
      fail(`${file}:${i + 1}: อ่านบรรทัดนี้ไม่ได้ -> ${line.trim()}`);
      continue;
    }
    key = kv[1];
    const value = kv[2].trim();
    meta[key] = value ? unquote(value) : [];
  }
  const body = lines.slice(end + 1).join('\n').trim();
  if (!body) fail(`${file}: ไม่มีเนื้อพรอมป์หลัง front matter`);
  return { meta, body };
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...await walk(join(dir, entry.name)));
    else if (entry.name.endsWith('.md')) out.push(join(dir, entry.name));
  }
  return out;
}

const files = (await walk(promptsDir)).sort();
const items = [];
const seenId = new Map();
const seenSlug = new Map();
let newest = 0;

for (const abs of files) {
  const file = relative(promptsDir, abs).split('\\').join('/');
  const text = await readFile(abs, 'utf8');
  const stamp = (await stat(abs)).mtimeMs;
  if (stamp > newest) newest = stamp;

  const parsed = parseFrontMatter(text, file);
  if (!parsed) continue;
  const { meta } = parsed;

  const missing = REQUIRED.filter((k) => meta[k] === undefined || meta[k] === '');
  if (missing.length) {
    fail(`${file}: ขาด key -> ${missing.join(', ')}`);
    continue;
  }

  const id = String(meta.id).padStart(2, '0');
  const base = file.split('/').pop();
  if (!/^\d{2}$/.test(id)) fail(`${file}: id ต้องเป็นเลขสองหลัก`);
  if (!base.startsWith(`${id}-`)) fail(`${file}: ชื่อไฟล์ต้องเริ่มด้วย ${id}-`);
  if (seenId.has(id)) fail(`${file}: id ${id} ซ้ำกับ ${seenId.get(id)}`);
  seenId.set(id, file);
  if (seenSlug.has(meta.slug)) fail(`${file}: slug "${meta.slug}" ซ้ำกับ ${seenSlug.get(meta.slug)}`);
  seenSlug.set(meta.slug, file);

  if (!TRACKS.includes(meta.track)) fail(`${file}: track "${meta.track}" ไม่อยู่ในรายการ ${TRACKS.join(', ')}`);
  if (file.split('/')[0] !== meta.track) fail(`${file}: ไฟล์ต้องอยู่ในโฟลเดอร์ ${meta.track}/ ตาม track`);

  const tags = Array.isArray(meta.tags) ? meta.tags : String(meta.tags).split(',').map((s) => s.trim());
  const checkTh = Array.isArray(meta.check_th) ? meta.check_th : [meta.check_th];
  const checkEn = Array.isArray(meta.check_en) ? meta.check_en : [meta.check_en];
  if (!checkTh.length || !checkEn.length) fail(`${file}: ต้องมีจุดจับผิดอย่างน้อย 1 ข้อทั้ง th และ en`);
  if (checkTh.length !== checkEn.length) fail(`${file}: จำนวนจุดจับผิด th (${checkTh.length}) กับ en (${checkEn.length}) ไม่เท่ากัน`);

  const duration = Number(meta.duration);
  const fps = Number(meta.fps);
  if (!Number.isFinite(duration) || duration <= 0) fail(`${file}: duration ต้องเป็นตัวเลขมากกว่า 0`);
  if (!Number.isFinite(fps) || fps <= 0) fail(`${file}: fps ต้องเป็นตัวเลขมากกว่า 0`);
  if (!/^\d+x\d+$/.test(String(meta.resolution))) fail(`${file}: resolution ต้องอยู่ในรูป 1920x1080`);
  if (!/\.mp4$/.test(String(meta.output))) fail(`${file}: output ต้องเป็นไฟล์ .mp4`);

  items.push({
    id,
    slug: meta.slug,
    track: meta.track,
    source: meta.source,
    title: { en: meta.title_en, th: meta.title_th },
    measures: { en: meta.measures_en, th: meta.measures_th },
    tags,
    output: meta.output,
    duration,
    fps,
    resolution: meta.resolution,
    checks: { en: checkEn, th: checkTh },
    file
  });
}

items.sort((a, b) => a.id.localeCompare(b.id));

if (problems.length) {
  console.error(`\nพบปัญหา ${problems.length} ข้อ:\n`);
  for (const p of problems) console.error('  • ' + p);
  console.error('');
  process.exit(1);
}

const index = {
  repo: 'agent-video-bench',
  version: 1,
  updated: new Date(newest).toISOString().slice(0, 10),
  note: 'Generated from the front matter of prompts/<track>/*.md by scripts/build-index.mjs. Edit the .md files, not this file.',
  items
};
const json = JSON.stringify(index, null, 2) + '\n';

if (checkOnly) {
  let current = '';
  try {
    current = await readFile(outFile, 'utf8');
  } catch { /* missing counts as stale */ }
  if (current !== json) {
    console.error('prompts/index.json ไม่ตรงกับไฟล์ .md — รัน `npm run build` แล้วคอมมิตผลลัพธ์');
    process.exit(1);
  }
  console.log(`ok: ${items.length} พรอมป์, index ตรงกับไฟล์ทั้งหมด`);
  process.exit(0);
}

await writeFile(outFile, json, 'utf8');
console.log(`index: ${items.length} พรอมป์`);
for (const item of items) {
  console.log(`  ${item.id}  ${item.track.padEnd(14)} ${item.file.padEnd(36)} ${item.checks.th.length} จุดจับผิด`);
}
