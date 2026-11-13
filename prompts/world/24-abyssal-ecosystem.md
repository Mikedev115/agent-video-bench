---
id: "24"
slug: abyssal-ecosystem
track: world
source: Gemini
title_th: ระบบนิเวศก้นทะเลลึกที่เรืองแสงชีวภาพ
title_en: Bioluminescent abyssal ecosystem
measures_th: วัดฉากใหญ่ใต้ทะเลที่ขับเคลื่อนด้วยอนุภาค แสง volumetric และการเปลี่ยนรูปจาก vertex shader
measures_en: A deep-sea scene built on particles, volumetric god-rays and vertex deformation
tags: Volumetric fog, Vertex deformation, Bioluminescence, Particle drift
output: abyssal_reef.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - แมงกะพรุนไม่หด-ขยายตาม sinusoid หรือทั้งฝูงเต้นพร้อมกันเป๊ะจนดูเหมือน copy
  - ไม่มี god-ray / volumetric จากไฟ ROV หรือลำแสงแบนเป็นแผ่น
  - marine snow นิ่งติดจอแทนที่จะลอยผ่านตามการเคลื่อนของกล้อง
check_en:
  - Do the jellyfish fail to contract along their sinusoid, or pulse in perfect unison like copies?
  - Are the ROV god-rays missing, or flattened into flat planes instead of volumes?
  - Does the marine snow stick to the screen instead of drifting past as the camera moves?
---

Create a deterministic 16-second 3D underwater film rendered to `abyssal_reef.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external models, textures or audio.

Tech: `t = frame / 30`, one seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta, 480 frames. All fauna deformed in the vertex shader from `uTime`, never from per-frame CPU mesh rebuilds.

Scene, 2000 m down: basalt hydrothermal-vent terrain with shimmering heat-plume particles rising from the chimneys; a school of 12 translucent bell jellyfish, each with its own phase offset, propelled by sinusoidal contraction-expansion (bell radius pulsing 10-18% at 0.35-0.55 Hz); swaying tube worms and siphonophores with bioluminescent pulses travelling along their lengths as a moving emissive band.

Optics: exponential depth fog (`#020813`), volumetric god-rays from a descending ROV's twin LED spotlights (ray-marched fog or layered volumetric slabs, not flat billboards), marine snow drifting in currents, and subtle chromatic aberration toward the lens edges. Only bioluminescence and the ROV lights illuminate the scene - no ambient fill.

Choreography:
- 0-5s: the ROV descends out of darkness, its beams sweeping across the vent field.
- 5-11s: the camera drifts through the jellyfish school while the tube worms pulse in a travelling wave.
- 11-16s: pull back and up, the vents' glow receding into fog as the frame darkens.

Visual style: scientific deep-sea footage - near-black cold palette, cyan/magenta bioluminescence, heavy falloff, no invented lens flares, no on-screen text.

Deliverables & gates:
1. `frames/` (480 PNGs), `abyssal_reef.mp4`, `contact-sheet.png`, `gates.log`.
2. Motion gate: log each jellyfish's bell radius per frame; every animal must show a peak-to-peak amplitude above 8% and phases must not all match.
3. Parallax gate: sampled snow-particle screen positions must move more than 12 px between frames 120 and 240 - snow stuck to the camera fails.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 240.
5. ffprobe: 16.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes.
