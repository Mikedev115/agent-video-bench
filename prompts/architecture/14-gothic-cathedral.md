---
id: "14"
slug: gothic-cathedral
track: architecture
source: Gemini
title_th: วิหารโกธิคผุดขึ้นจากความว่างเปล่า
title_en: Gothic cathedral assembly
measures_th: วัดความแม่นยำเรขาคณิตสถาปัตยกรรม (เสา วงโค้งปลายแหลม ค้ำยันลอย หน้าต่างกุหลาบ) คิวประกอบจากฐานสู่ยอด และ gate ที่ต้องผ่านก่อนส่ง
measures_en: Architectural geometry and build order, gated by determinism, temporal and ffprobe checks
tags: Procedural geometry, Staggered build, Stained glass, Determinism gates
output: gothic_cathedral.mp4
duration: 18
fps: 30
resolution: 1920x1080
check_th:
  - ค้ำยันลอยค้างกลางอากาศไม่แตะผนังเสา หรือระยะสัมผัสเกิน 10 มม.
  - หลังคามาก่อนเสา หรือลำดับประกอบข้ามขั้น
  - หน้าต่างกุหลาบซ้อนทับจนกระพริบ (Z-fighting) หรือ facade ไม่สมมาตร
check_en:
  - Do the flying buttresses hang in the air without touching the piers, or miss contact by more than 10 mm?
  - Is the build order wrong, with the roof arriving before the columns?
  - Does the rose window overlap and flicker with Z-fighting, or is the facade asymmetric?
---

You will render a short film of a Gothic cathedral assembling itself, as a real MP4 file. Work until the file exists and passes the gates at the end. Do not describe a plan instead of building it, and do not stop at generated code.

OUTPUT CONTRACT
- `gothic_cathedral.mp4`: 1920x1080, 30 FPS, exactly 18.0 s (540 frames), H.264, yuv420p.
- Also write `frames/` (540 PNGs), `contact-sheet.png` (12 frames, one every 1.5 s), and `gates.log`.
- Zero external assets: no GLTF/OBJ, no image textures, no HDR files, no audio. Every mesh, material and map is generated in code.

ENVIRONMENT
Node 20+, a Chromium you can drive headlessly (Playwright or Puppeteer), FFmpeg on PATH. Three.js is the only 3D dependency.

DETERMINISM (non-negotiable)
- `t = frame / 30` drives everything: geometry reveal, camera, lights, glass colour.
- One seeded PRNG, `mulberry32(1337)`, for every random value. `Math.random()` is forbidden, and no wall-clock value (`Date.now`, `performance.now`) may enter the render.
- No CSS/SVG animation, no video textures, no timing from requestAnimationFrame.

GEOMETRY - THE NUMBERS ARE THE TEST
- Nave: 8 bays at exactly 5.00 m spacing on X, clear width 12.00 m, arcade springing at y = 9.00 m.
- Piers: clustered, four shafts around a core, centres on the bay grid; centre-to-centre spacing must stay 5.00 m +/- 0.01.
- Pointed arches: two-centred. For span w, each arc has radius r = w and its centre sits w/2 either side of the springing; the apex must reach `springing + sqrt(r^2 - (w/2)^2)` within 5 mm.
- Rib vaults: quadripartite per bay, four diagonal ribs meeting at one boss; the four bosses of a bay share one height within 5 mm.
- Flying buttresses: outside the clerestory, each must touch the wall at the springing (surface distance under 10 mm) and land on an outer pier buttress. A floating buttress fails.
- Rose window: 8.00 m outer diameter, 12-fold radial tracery, 3 concentric rings, panes emissive and coloured procedurally per pane.
- From the final camera position the nave, both aisles and the vault overhead must be visible; the facade may not occlude them.

CHOREOGRAPHY (the order is part of the test)
- 0-4 s: foundation plinths and clustered columns rise from the ground with cubic-out easing.
- 4-9 s: pointed arches, side aisles and flying buttresses fly in symmetrically about the nave axis. Nothing may intersect while in flight.
- 9-14 s: rib vaults weave together overhead, then the facade towers and central spire lock in.
- 14-18 s: interior lights ignite in a wave from the west end; stained-glass beams land on the stone floor.
- Camera: low three-quarter exterior orbit rising toward the spire, then a glide through the main portal into the lit nave. Cubic easing on every move; the camera may never enter geometry.

GATES - run them, print real numbers to `gates.log`, re-render on failure
1. Determinism: render twice from the same seed; sha256 of frame 300 must match.
2. Temporal: sampled consecutive frames must differ (MSE above 0.0005), and no frame may be more than 99% one colour.
3. Container: ffprobe reports 18.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.
4. Geometry asserts: pier spacing, arch apex heights, boss heights, buttress contact, and at least 2 mm depth separation wherever two surfaces are parallel (no Z-fighting).
5. Symmetry: facade vertices mirrored about x = 0 agree within 10 mm.
6. Camera: assert every camera position stays at least 0.25 m clear of collision geometry.

Finish with a short table of gate results carrying the measured numbers. If a gate fails and you cannot fix it, name it and stop. Never present a failing render as done.
