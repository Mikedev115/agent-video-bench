---
id: "02"
slug: rube-goldberg
track: rigid-body
source: Gemini
title_th: เครื่องจักรลูกโซ่ Rube Goldberg
title_en: Rube Goldberg chain
measures_th: วัดการผสาน Physics Engine & กล้องติดตาม
measures_en: Physics engine integration and a tracking camera
tags: Rapier, cannon-es, Fixed timestep, Camera rig
output: rube_goldberg.mp4
duration: 18
fps: 30
resolution: 1920x1080
check_th:
  - โดมิโนล้มไม่ถึงตัวสุดท้าย
  - คานกระดกดีดลูกบอลไม่ถึงสะพาน
  - กล้องตามวัตถุไม่ทันจนหลุดเฟรม
check_en:
  - Do the dominoes fall all the way to the last one?
  - Does the lever throw the sphere far enough to reach the bridge?
  - Does the camera lose the action and let it leave the frame?
---

Create a deterministic 3D Rube Goldberg physics simulation exported to `rube_goldberg.mp4` (1920x1080, 30 FPS, 18 seconds) using Three.js, a real rigid-body physics engine (`cannon-es` or `@dimforge/rapier3d-compat`), headless browser rendering, and FFmpeg.

Scene & Physics Chain:

1. Build a multi-stage elevated track in a minimalist architectural studio.
2. Stage 1 (0-4s): A heavy steel sphere rolls down a curved spiral ramp and accelerates.
3. Stage 2 (4-8s): The sphere strikes a row of 12 dominoes arranged in an S-curve; the last domino knocks a counterweight off a ledge.
4. Stage 3 (8-13s): The falling counterweight pulls down one side of a seesaw lever, launching a lighter glowing sphere onto an upper glass bridge.
5. Stage 4 (13-18s): The glowing sphere rolls across the bridge and drops into a funnel that triggers a celebratory burst of 200 rigid-body cubes.
6. Camera & Determinism: Step the physics world at a fixed timestep (`1/120s`, 4 substeps per video frame) so the chain reaction succeeds 100% reliably. Implement a smooth damped look-at camera that dynamically tracks the active point of kinetic energy throughout all 4 stages. Verify the final MP4 by sampling frames across all 4 stages.
