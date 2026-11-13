---
id: "19"
slug: newtons-cradle
track: rigid-body
source: Gemini
title_th: เปลนิวตันโครมเมียมและการส่งผ่านโมเมนตัม
title_en: Chrome Newton's cradle momentum transfer
measures_th: วัดการส่งผ่านโมเมนตัม การชนแบบ elastic และการตรวจผลด้วย determinism gate
measures_en: Momentum transfer and elastic collision, gated by a determinism check
tags: Rapier, Restitution, Contact flash, Macro DOF
output: newtons_cradle.mp4
duration: 12
fps: 30
resolution: 1920x1080
check_th:
  - ลูกสุดท้ายไม่กระเด็นหลังชน (โมเมนตัมไม่ส่งต่อถึงลูกที่ 7) หรือมุมที่กระเด็นไม่ถึง 50 องศา
  - ลูกบอลสั่นค้างตอนนิ่ง หรือระยะห่างไม่เท่ากันจนชนกันตลอดเวลา
  - ไม่มี shockwave ที่จุดชน หรือไฮไลต์โครมเด้งผิดจังหวะกับการชน
check_en:
  - Does sphere 7 fail to fly out, or leave at less than 50 degrees?
  - Do the spheres keep jittering at rest, or sit at uneven spacing so they collide forever?
  - Is the contact shockwave missing, or do the chrome highlights flash off-beat from the impact?
---

Create a deterministic 12-second 3D physics film rendered to `newtons_cradle.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js with `@dimforge/rapier3d-compat` in headless Chromium, encoded with FFmpeg. Zero external models, textures, HDRIs or audio files.

Tech: step physics at a fixed `1/120 s` with 4 substeps per video frame. Every random draw comes from one seeded PRNG (`mulberry32(1337)`); `t = frame / 30` drives camera and lights. No `Math.random()`, no wall-clock delta, no keyframed motion standing in for simulation.

Scene: seven chrome steel spheres (r = 0.05 m) hang from a brushed titanium frame on dual braided wires, centres 0.1005 m apart so each rests with a 1 mm gap. Restitution 0.98, linear damping 0.0005, gravity -9.81. Sphere 1 is lifted to 55 degrees and released at t = 0.5 s.

Choreography:
- 0-2s: three-quarter establishing wide, camera dollying 40 degrees around the frame.
- 2-8s: the impact chain. Only sphere 7 may leave the stack; log its exit angle on every swing to stdout and keep it within 5 degrees of 55.
- 8-12s: macro close-up of the impact zone with shallow depth of field; a 0.15 s shockwave ring at each contact point and a 120 Hz damped 3 mm vibration on the struck sphere for 0.2 s.

Materials: PBR chrome reflecting its neighbours and a procedural studio environment (PMREMGenerator), anisotropic brushed metal on the frame, soft contact shadows on dark slate.

Visual style: precision-instrument film. Near-black studio, one cool key light, one warm rim (`#ffb066`), high-contrast speculars, shallow DOF, no on-screen text.

Deliverables & gates:
1. `frames/` (360 PNGs), `newtons_cradle.mp4`, `contact-sheet.png` (12 frames at 1 s intervals).
2. Determinism gate: render twice from the same seed; the sha256 of frame 150 must be identical.
3. Temporal gate: mean squared error between consecutive sampled frames must exceed 0.0005 - a frozen or black run fails.
4. ffprobe: duration 12.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Fix a failing gate and re-render; never ship a run that fails one.
