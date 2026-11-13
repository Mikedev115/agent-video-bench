---
id: "21"
slug: kinetic-facade
track: architecture
source: Gemini
title_th: อาคารบานเกล็ดจลน์ที่ติดตามดวงอาทิตย์
title_en: Kinetic facade tracking the sun
measures_th: วัดการคำนวณมุมบานเกล็ด 360 ชุดจาก dot product กับเวกเตอร์ดวงอาทิตย์ พร้อมการชนกันของบาน
measures_en: 360 louver modules driven by the sun dot product, with collision-free folding
tags: Instanced rigging, Solar vector, Hinged panels, Shadow study
output: kinetic_facade.mp4
duration: 14
fps: 30
resolution: 1920x1080
check_th:
  - บานเกล็ดเปิด-ปิดพร้อมกันหมดแทนที่จะต่างกันตามทิศที่โดนแดด
  - บานที่ปิดสนิทชนหรือทะลุกันเอง หรือทะลุกระจกด้านหลัง
  - เงาบนลานหน้าอาคารไม่ขยับตามการเคลื่อนของดวงอาทิตย์
check_en:
  - Do all louvers open and close in unison instead of varying with their own sun exposure?
  - Do closed louvers collide with or pass through each other, or through the glass behind them?
  - Does the plaza shadow stay put while the sun moves?
---

Create a deterministic 14-second architectural film rendered to `kinetic_facade.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external models or textures.

Tech: build the facade as instanced geometry driven per frame from `t = frame / 30`; one seeded PRNG (`mulberry32(1337)`); no `Math.random()`, no wall-clock delta. 420 frames exactly.

Parametric spec: a curved glass curtain wall carries a 15 x 24 grid of 360 hexagonal kinetic modules (after Al Bahar Towers). Each module is six triangular PTFE-coated panels hinged on an actuator strut, folding between aperture 1.0 (open) and 0.0 (closed).

Formula, not animation: for module (i, j) with surface normal `n_ij` and sun direction `s(t)`, `aperture = clamp(1 - dot(n_ij, s) * k, 0, 1)`, with `k` tuned so sun-facing modules close hardest. Assert per frame that no folded panel intersects its neighbour or the glass plane; log the worst clearance to stdout, it must stay above 2 mm.

Choreography:
- 0-6s: the sun climbs from the east at a low warm `#ffb066`; a street-level crane looks up the curve as the aperture field starts closing on the sun side.
- 6-10s: harsh white overhead sun, apertures ripple across the facade, camera eases into an oblique three-quarter view that shows the gradient.
- 10-14s: sun drops west in deep orange-magenta `#ff5b3c`; the shadow of the louver field slides across the plaza paving.

Materials & style: tinted reflective glass behind the louvers, procedural studio-and-sky environment via PMREMGenerator, matte PTFE panels with a slight sheen, minimalist neighbouring block silhouette. Style: architectural study - restrained palette, long shadows, no on-screen text.

Deliverables & gates:
1. `frames/` (420 PNGs), `kinetic_facade.mp4`, `contact-sheet.png`, `aperture-log.csv` (mean aperture per frame).
2. The mean aperture must change by more than 0.25 between frame 60 and frame 300 - a static facade fails.
3. Determinism gate: two renders from the same seed, identical sha256 for frame 210.
4. ffprobe: 14.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes.
