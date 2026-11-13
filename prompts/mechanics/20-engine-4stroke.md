---
id: "20"
slug: engine-4stroke
track: mechanics
source: Gemini
title_th: เครื่องยนต์ 4 สูบตัดเปิดและจังหวะ 4 จังหวะ
title_en: Inline-4 turbo engine cutaway cycle
measures_th: วัดความแม่นยำเชิงกล (จังหวะวาล์ว ลำดับจุดระเบิด ข้อเหวี่ยง) ที่ต้องยืนยันด้วยการ assert ทุกเฟรม
measures_en: Valve timing, firing order and crank motion, asserted every single frame
tags: Valve timing, Firing order, Translucent PBR, Technical camera
output: engine_cycle.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - จังหวะวาล์วไม่ตรงลำดับจุดระเบิด 1-3-4-2 หรือวาล์วเปิดค้างนอกช่วง lobe ของตัวเอง
  - ลูกสูบโผล่พ้นกระบอก ก้านสูบหลุดจากข้อเหวี่ยง หรือลูกสูบชนวาล์ว
  - สีแก๊สในกระบอกไม่เปลี่ยนตามจังหวะ (ดูด อัด ระเบิด คาย) หรือเปลี่ยนช้ากว่าลูกสูบ
check_en:
  - Do the valves ignore the 1-3-4-2 firing order, or stay open outside their own lobe window?
  - Does a piston leave its bore, does a rod detach from the crank, or does a piston hit a valve?
  - Does the gas colour fail to follow the stroke, or change later than the piston does?
---

Create a deterministic 15-second 3D technical cutaway rendered to `engine_cycle.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external models or textures.

Tech: geometry and motion are computed per frame from `t = frame / 30`, never keyframed or pre-baked to video. One seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta. Exactly 450 frames.

Mechanical spec: inline-4, bore 82 mm, stroke 86 mm, rod length 143 mm. Piston height `y = r*cos(theta) + sqrt(L^2 - (r*sin(theta))^2)`; valve lift read from a cam profile keyed to `theta` over a 720-degree cycle with firing order 1-3-4-2. Every valve's lift must be 0 outside its own lobe window - assert this each frame and exit non-zero on violation. Dual overhead cams driven by a timing chain, counterweighted crankshaft, turbocharger turbine on the exhaust manifold.

Choreography:
- 0-5s: exploded view. Pistons, crank, cams and block slide together into operating position along their assembly axes with cubic easing, nothing passing through anything.
- 5-15s: the engine runs from 300 rpm (analysis slow motion) to 1800 rpm while the camera orbits from front three-quarter to a side cross-section.

Materials & staging: translucent polycarbonate block and head so the internals read; cylinder gas colour driven by the same `theta` - cyan mist on intake, amber on compression, orange-white flash with rapid expansion on power, dark crimson-grey on exhaust.

Visual style: engineering cutaway film. Cool grey studio, one raking key light to separate the glass, crisp contact shadows on the bench, no on-screen text.

Deliverables & gates:
1. `frames/` (450 PNGs), `engine_cycle.mp4`, `contact-sheet.png` (12 frames), `assertions.log`.
2. Determinism gate: two renders from the same seed must produce identical sha256 for frame 300.
3. Temporal gate: MSE between sampled consecutive frames above 0.0005; also assert no frame is more than 99% single-colour.
4. ffprobe: 15.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes; a silent assertion failure is a failed job.
