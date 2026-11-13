---
id: "30"
slug: granular-hourglass
track: soft-and-fluid
source: Aetox
title_th: นาฬิกาทรายและเม็ดทราย 20,000 เม็ดที่ต้องไม่หาย
title_en: Granular hourglass with conserved grains
measures_th: วัดตัวแก้ granular ที่ต้องคงจำนวนเม็ด มุมเทของกองทราย และการไม่ทะลุกระจก
measures_en: A granular solver that conserves grains, holds the angle of repose and never tunnels
tags: DEM, Friction, Angle of repose, Particle budget
output: granular_hourglass.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - จำนวนเม็ดทรายลดลงระหว่างรัน (เม็ดหลุดหรือถูกลบเงียบ ๆ)
  - เม็ดทรายทะลุผนังกระจกออกไปนอกนาฬิกา
  - กองทรายราบแบนหรือไหลไม่หยุด เพราะไม่มีแรงเสียดทานภายใน
check_en:
  - Does the grain count drop during the run (grains escaping or silently deleted)?
  - Do grains tunnel through the glass to the outside?
  - Does the pile flatten out or keep flowing forever because internal friction is missing?
---

Create a deterministic 15-second 3D granular simulation rendered to `granular_hourglass.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js with a position-based granular solver written for this job, headless Chromium, and FFmpeg. Zero external models or textures.

Tech: 20,000 grains of radius 0.8 mm simulated at a fixed `1/240 s` (8 substeps per video frame), neighbour search on a spatial hash, Coulomb friction with `mu_s = 0.55`, `mu_k = 0.45`, restitution 0.1. One seeded PRNG (`mulberry32(1337)`) for the initial packing and all jitter; no `Math.random()`, no wall-clock delta; `t = frame / 30`, 450 frames.

Scene: a glass hourglass (IOR 1.52, thin walls) with a 24 mm neck, filled in the upper bulb with the full 20,000 grains, above a matte stone pedestal. Lighting from a single soft key plus a warm rim so the glass reads and the grains cast real shadows.

What must actually happen:
- Grains flow through the neck under gravity and build a cone in the lower bulb. Measure the pile's angle of repose from the surface fit and keep it between 30 and 34 degrees - that number is the test of whether friction is real.
- The grain count must stay exactly 20,000 for all frames, and no grain may end a frame inside the glass wall or outside the bulbs: assert every frame and log `MAX_PENETRATION` and `GRAIN_COUNT` to stdout.
- Mass flow through the neck must start within 0.5 s and stay roughly steady; log grains-per-second per frame.

Choreography: starts in a macro on the neck as the first grains fall; the camera pulls back and cranes up to reveal the growing cone and the emptying upper bulb, ending on a three-quarter wide.

Visual style: quiet laboratory object study - glass, sand, stone, one warm rim, restrained motion, no on-screen text.

Deliverables & gates:
1. `frames/` (450 PNGs), `granular_hourglass.mp4`, `contact-sheet.png`, `grains.csv` (count, flow rate, penetration per frame).
2. Conservation gate: grain count 20,000 on every frame; penetration 0.
3. Friction gate: measured repose angle within 30-34 degrees on the final frame.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 225.
5. ffprobe: 15.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes; a pile that slumps flat means the solver is lying.
