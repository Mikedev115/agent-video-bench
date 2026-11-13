---
id: "07"
slug: fluid-dambreak
track: soft-and-fluid
source: Aetox
title_th: น้ำทะลักในถังแก้ว (GPU fluid)
title_en: GPU fluid dam break
measures_th: วัดตัวแก้ particle บน GPU กับปริมาตรน้ำที่ต้องไม่หาย
measures_en: GPU particle solver inside a volume that has to stay conserved
tags: SPH / PBF, GPU compute, Refraction, Whitewater
output: fluid_dambreak.mp4
duration: 14
fps: 30
resolution: 1920x1080
check_th:
  - อนุภาครั่วออกนอกถังหรือหยุดนิ่งค้าง
  - ปริมาตรน้ำหดลงเพราะ solver ทำมวลหาย
  - ผิวน้ำและการหักเหเป็นขั้นบันไดหรือกระพริบเป็นช่วง ๆ
check_en:
  - Do particles leak out of the tank or freeze in place?
  - Does the water volume shrink because the solver loses mass?
  - Do the surface and the refraction show banding or popping?
---

Create a deterministic 3D fluid simulation rendered to `fluid_dambreak.mp4` (1920x1080, 30 FPS, 14 seconds) using Three.js on WebGL2, GPU particle SPH/PBF (transform feedback or `GPUComputationRenderer`), headless Chromium, and FFmpeg. Zero external assets.

Scene & Physics Requirements:

1. A glass tank (IOR 1.52) with a removable dam wall holds 90,000 water particles above four rigid blocks. At frame 0 the wall slides away and the column collapses.
2. Solver: PBF/PCISPH with 4 substeps per video frame, particles seeded on a jittered grid from one seeded PRNG, kernel radius `h = 1.6 * particle spacing`. Keep density error under 1%, and clamp speed to `0.4 * h / dt` so no particle tunnels through the tank wall.
3. Rendering: screen-space fluid with depth + thickness maps and bilateral blur, Fresnel refraction/reflection with Beer-Lambert absorption, and separate whitewater particles spawned from curvature and velocity thresholds.
4. Lighting: procedural studio environment via PMREMGenerator plus a blurred thickness-map projection on the floor that reads as caustics.
5. Determinism: fixed `dt`, no timers, no `Math.random()`. Log per frame: particle count (must stay 90,000) and total volume (must stay within 1% of initial).
6. Verify from extracted frames: no particle leaves the tank, no frozen or exploded frame, the surface is smooth without per-frame popping, and the refraction has no banding.
