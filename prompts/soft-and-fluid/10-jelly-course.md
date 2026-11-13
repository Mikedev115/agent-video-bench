---
id: "10"
slug: jelly-course
track: soft-and-fluid
source: Gemini
title_th: ก้อนเจลลี่ยืดหยุ่นผ่านด่านลูกกลิ้งและแทรมโพลีน
title_en: Soft-body jelly obstacle course
measures_th: วัดการจำลองวัตถุอ่อนนุ่ม 3 มิติที่ต้องรักษาปริมาตร ไม่ให้ยุบแบนแล้วคืนรูปไม่ได้
measures_en: A 3D soft body that has to keep its volume while it deforms
tags: 3D mass-spring, Volume preservation, Transmission, Substeps
output: jelly_course.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - ก้อนเจลลี่แบนติดพื้นแล้วไม่เด้งคืนรูป
  - ผิวโมเดลสั่นกระตุกยิก ๆ ตลอดเวลา
  - ก้อนเจลลี่ทะลุผ่านลูกกลิ้ง
check_en:
  - Does the jelly flatten onto the floor and never recover its shape?
  - Does the surface jitter non-stop instead of settling?
  - Does the jelly pass through the rollers?
---

Build a 15-second 3D soft-body physics obstacle course rendered to `jelly_course.mp4` (1920x1080, 30 FPS) using Three.js, a custom or library-backed 3D soft-body mass-spring/FEM solver, headless Chromium, and FFmpeg.

Soft-Body & Course Specifications:

1. Soft-Body Subject: Create a subdivided translucent gelatinous cube/sphere with an internal 3D spring lattice (outer skin + cross-bracing volume springs) that squishes, stretches, and wobbles upon impact while preserving overall volume.
2. Obstacle Course:
   - (0-5s) The soft-body drops onto an angled glass slide and squeezes through a pair of counter-rotating rollers narrower than its resting width.
   - (5-10s) It launches off an elastic trampoline pad, compressing dramatically on contact before rebounding high into the air.
   - (10-15s) It lands inside a clear cylindrical glass beaker, jiggling to rest with damped harmonic ripples.
3. Visuals & Determinism: Render the soft-body with physical transmission/refraction, glossy specular highlights, and crisp studio soft shadows. Step physics at fixed micro-timesteps (`1/240s`, 8 substeps per frame) for stability, render deterministically, verify keyframes for clean compression/recovery, and compile `jelly_course.mp4`.
