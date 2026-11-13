---
id: "16"
slug: suspension-bridge
track: architecture
source: Gemini
title_th: สะพานแขวนโครงถักและการคำนวณสายเคเบิลพาราโบลา
title_en: Parametric suspension bridge assembly
measures_th: วัดคณิตศาสตร์การเชื่อมจุดระหว่างเส้นโค้งพาราโบลาของสายเคเบิลกับความโค้งของพื้นสะพานด้วยลวดสลิงนับร้อยเส้น
measures_en: Joining a parabolic cable curve to an arched deck with hundreds of vertical hangers
tags: Catenary math, Sweep, Warren truss, Staged build
output: suspension_bridge.mp4
duration: 17
fps: 30
resolution: 1920x1080
check_th:
  - ลวดสลิงแนวตั้ง (Suspender cables) ยาวทะลุพื้นสะพานลงไปด้านล่าง
  - ลวดสลิงลอยไม่แตะสายเคเบิลหลักด้านบน
check_en:
  - Do the vertical hangers run past the bridge deck and hang below it?
  - Do the hangers float free instead of reaching the main cable above?
---

Generate a 17-second procedural engineering visualization `suspension_bridge.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. No external assets allowed.

Parametric Engineering & Timeline:

1. Mathematical Precision: Build a grand suspension bridge spanning a misty canyon river. Compute exact parabolic catenary curves $y_{cable}(x)$ for the two main suspension cables and a subtle vertical arch $y_{deck}(x)$ for the roadway. Every vertical suspender rope MUST span the exact distance from $y_{deck}(x_i)$ to $y_{cable}(x_i)$ with zero gaps or overshoot.
2. Construction Choreography:
   - (0-4s) Concrete caissons and twin Art-Deco steel towers erect segment-by-segment from the water up.
   - (4-8s) Thick main suspension cables extrude/sweep smoothly from anchorages over tower saddles across the main span.
   - (8-12s) Vertical suspender cables drop down in rapid sequential waves, followed by Warren-truss deck sections snapping into place from both towers toward the center.
   - (12-17s) Streetlights ignite in a sweeping wave across the span, and miniature light-trail vehicles begin crossing the completed bridge at dusk.
3. Render frame-by-frame deterministically (`t = frame / 30`), inspect close-up keyframe PNGs at the cable-to-deck junctions, and encode to `suspension_bridge.mp4`.
