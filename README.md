# Agent Video Bench

**18 prompts that force a coding agent to render real 3D video** — not to describe it, not to ship a mock, but to produce an `.mp4` you can open and inspect frame by frame.

*คลังพรอมป์สำหรับสั่งเอเจนต์สร้างวิดีโอ 3 มิติแบบ procedural พร้อม "จุดจับผิด" ที่บอกว่าให้ไปดูอะไรในไฟล์ผลลัพธ์*

Every prompt demands the same discipline: everything procedural (no external models, textures or audio), a deterministic clock (`t = frame / 30`), a headless browser writing lossless frames, FFmpeg encoding H.264/yuv420p, and a self-check on extracted keyframes. Each card on the site lists the failures that actually happen — clipped gear teeth, a domino chain that stalls, blooming that blows the frame white, kick drums that drift out of sync.

**Browse the set: https://mikedev115.github.io/agent-video-bench/**

## What is in here

| # | Track | Prompt | Output | Length |
|---|-------|--------|--------|--------|
| 01 | mechanics | [Tourbillon movement](prompts/mechanics/01-tourbillon.md) | `tourbillon.mp4` | 15s |
| 02 | rigid-body | [Rube Goldberg chain](prompts/rigid-body/02-rube-goldberg.md) | `rube_goldberg.mp4` | 18s |
| 03 | shader | [Fractal raymarch morph](prompts/shader/03-raymarch-morph.md) | `raymarch_morph.mp4` | 15s |
| 04 | world | [Cyberpunk megacity flythrough](prompts/world/04-cyberpunk-flythrough.md) | `cyberpunk_flythrough.mp4` | 16s |
| 05 | audio | [Audio-reactive particle symphony](prompts/audio/05-audio-vortex.md) | `audio_vortex.mp4` | 15s |
| 06 | soft-and-fluid | [Silk cloth over an armature](prompts/soft-and-fluid/06-cloth-drape.md) | `cloth_drape.mp4` | 16s |
| 07 | soft-and-fluid | [GPU fluid dam break](prompts/soft-and-fluid/07-fluid-dambreak.md) | `fluid_dambreak.mp4` | 14s |
| 08 | rig | [Procedural walk cycle](prompts/rig/08-rig-walk.md) | `rig_walk.mp4` | 12s |
| 09 | soft-and-fluid | [Storm galleon: Gerstner ocean + Verlet sails](prompts/soft-and-fluid/09-storm-sails.md) | `storm_sails.mp4` | 16s |
| 10 | soft-and-fluid | [Soft-body jelly obstacle course](prompts/soft-and-fluid/10-jelly-course.md) | `jelly_course.mp4` | 15s |
| 11 | soft-and-fluid | [Zen garden ripples (PDE heightfield)](prompts/soft-and-fluid/11-water-ripples.md) | `water_ripples.mp4` | 16s |
| 12 | soft-and-fluid | [Viscous fluid in a spinning tank](prompts/soft-and-fluid/12-fluid-centrifuge.md) | `fluid_centrifuge.mp4` | 15s |
| 13 | soft-and-fluid | [Parachute deployment, two-way coupled](prompts/soft-and-fluid/13-parachute-drop.md) | `parachute_drop.mp4` | 16s |
| 14 | architecture | [Gothic cathedral assembly](prompts/architecture/14-gothic-cathedral.md) | `gothic_cathedral.mp4` | 18s |
| 15 | architecture | [Transforming steampunk puzzle box](prompts/architecture/15-puzzle-box.md) | `puzzle_box.mp4` | 16s |
| 16 | architecture | [Parametric suspension bridge](prompts/architecture/16-suspension-bridge.md) | `suspension_bridge.mp4` | 17s |
| 17 | architecture | [Orbital station assembly](prompts/architecture/17-orbital-station.md) | `orbital_station.mp4` | 18s |
| 18 | architecture | [Impossible Escher architecture](prompts/architecture/18-impossible-maze.md) | `impossible_maze.mp4` | 16s |

**Tracks:** `mechanics` (gear trains, spatial math) · `rigid-body` (physics engine, chain reactions) · `soft-and-fluid` (cloth, soft bodies, particles, heightfields) · `shader` (hand-written GLSL, SDF raymarching) · `world` (instancing, post-processing, spline flight) · `architecture` (procedural structures, pivots, assembly order) · `rig` (skinning, IK, contact) · `audio` (synthesis, FFT, muxing)

## Use it

1. Open the page, pick a card, copy the prompt.
2. Paste it into an agent that can run code — Node 20+, a Chromium it can drive, and `ffmpeg` on `PATH`.
3. Check the result against that card's **what to catch** list, on the exported MP4 and on the keyframe PNGs the agent claims it inspected. If it fails, send it back with the number of the item.

The whole set is also machine-readable, so an agent can read the catalogue itself:

```text
prompts/index.json     # every prompt: id, track, tags, output, duration, checks (th + en), file path
prompts/<track>/*.md   # the prompt text, verbatim, ready to paste
```

## Repository layout

```text
index.html               catalogue page (static, no build step, reads prompts/index.json)
assets/                  page CSS and JS
prompts/
  index.json             generated — do not edit by hand
  <track>/<id>-<slug>.md one prompt per file: front matter + prompt text
scripts/build-index.mjs  reads the front matter, validates, writes index.json
scripts/serve.mjs        zero-dependency static server for local preview
.github/workflows/       CI that fails when index.json is out of date
```

## Add a prompt

```bash
# 1. create prompts/<track>/<id>-<slug>.md  (id continues the two-digit sequence)
# 2. add the front matter block at the top of that file
# 3. regenerate and validate
npm run build
npm run check
```

Front matter keys — all required, `th` and `en` for anything a reader sees:

| Key | Meaning |
|-----|---------|
| `id` | two digits, must match the file name prefix (`07` → `07-fluid-dambreak.md`) |
| `slug` | unique, kebab-case, used in the page's deep link |
| `track` | one of the tracks above; must match the folder name |
| `source` | where the prompt came from (`Gemini`, `Aetox`, your name) |
| `title_th` / `title_en` | card title |
| `measures_th` / `measures_en` | the skill the prompt tests, one line |
| `tags` | comma-separated, shown as chips on the card |
| `output` | the `.mp4` filename the agent must produce |
| `duration` / `fps` / `resolution` | the contract the output has to meet |
| `check_th` / `check_en` | the "what to catch" bullets, one `- ` line each, same count in both languages |

CI runs `node scripts/build-index.mjs --check` on every push, so a stale `index.json` or a prompt missing its Thai checks fails the build instead of shipping.

## Local preview

```bash
npm start          # http://localhost:4173
```

Opening `index.html` straight from disk will not work: the page fetches `prompts/index.json`, and browsers block that on `file://`.

## Credits

- Prompts 01–05 were written by **Gemini**, passed on by Mike.
- Prompts 06–08 and the library structure were written for this repo.
- Prompts 09–18 were written by **Gemini**, passed on by Mike.

The prompt texts are kept verbatim so a result can be compared against the same wording everyone else ran. MIT licensed — copy, fork, translate, add your own.
