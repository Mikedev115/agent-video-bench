---
id: "28"
slug: quadruped-trot
track: rig
source: Aetox
title_th: สัตว์สี่ขาสามมิติวิ่งเหยาะด้วย IK ที่ไม่ไถล
title_en: Quadruped trot with planted-foot IK
measures_th: วัดโครงกระดูก 24 กระดูก, ท่า trot แบบคู่ทแยง และการยึดเท้ากับพื้นจนถึงระดับมิลลิเมตร
measures_en: A 24-bone rig, diagonal-pair trot, and feet that stay planted to the millimetre
tags: Skeleton, Two-bone IK, Duty factor, Spine undulation
output: quadruped_trot.mp4
duration: 12
fps: 30
resolution: 1920x1080
check_th:
  - เท้าไถลบนพื้นระหว่างช่วง stance หรือขาคู่ทแยงไม่สลับจังหวะกันแบบ trot
  - เท้าจมลงใต้พื้นหรือลอยเหนือพื้นตอนควรจะยึดอยู่
  - กระดูกสันหลังไม่ยุบ-ยืดตามจังหวะ หรือหางแข็งไม่หน่วงตามการเคลื่อน
check_en:
  - Do the feet slide during stance, or do the diagonal pairs fail to alternate in a trot?
  - Do feet sink below the ground or float above it while they should be planted?
  - Does the spine fail to compress and extend with the stride, or the tail stay rigid instead of lagging?
---

Create a deterministic 12-second 3D creature study rendered to `quadruped_trot.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js `Skeleton` + `SkinnedMesh` in headless Chromium and FFmpeg. The body is built procedurally from primitives merged into one skinned mesh - no GLTF, no external rigs, no motion capture.

Tech: `t = frame / 30`, one seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta, 360 frames.

Rig: 24 bones - pelvis, 3 spine bones, neck, head, tail chain of 6, and four legs of 3 bones each. Bake smooth skin weights from bone distance, normalised so every vertex's weights sum to 1.0.

Gait, computed not keyframed: trot, diagonal pairs in phase (front-left with rear-right), stride period 0.5 s, duty factor 0.45. Each stance foot is solved with two-bone IK against a world-space target that is locked the moment stance begins - the foot may not drift more than 1 mm from that target until lift-off. Log the worst drift across the whole clip.

Constraints: no vertex below `y = 0` (assert per frame); forward speed must equal the backward travel of the stance feet so the body never moonwalks; spine compresses and extends by 3% of its length per stride; the tail chain lags the pelvis by about 0.12 s.

Choreography: camera orbits 120 degrees around the animal at a low three-quarter angle, easing with cubic curves, while a soft contact shadow keeps the feet anchored visually.

Visual style: studio creature study - warm bronze clay material, three-point lighting, plain seamless floor, motion crisp at 30 FPS, no on-screen text.

Deliverables & gates:
1. `frames/` (360 PNGs), `quadruped_trot.mp4`, `contact-sheet.png`, `gait.csv` (per-foot planted position and drift per frame).
2. Drift gate: worst stance drift under 1 mm.
3. Contact gate: zero vertices below the floor; stance feet within 0.5 mm of the floor plane.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 180.
5. ffprobe: 12.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes.
