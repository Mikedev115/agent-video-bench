---
id: "09"
slug: storm-sails
track: soft-and-fluid
source: Gemini
title_th: เรือใบฝ่าคลื่นยักษ์และธงผ้าสะบัดตามแรงลม
title_en: Storm galleon with Gerstner ocean and Verlet sails
measures_th: วัดระบบผ้าแบบ Mass-Spring (Verlet) ผสานแรงลอยตัวของเรือบนผิวน้ำ Gerstner
measures_en: Verlet cloth coupled to hull buoyancy on a multi-octave Gerstner ocean
tags: Gerstner waves, Verlet cloth, Buoyancy, Collision
output: storm_sails.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - ผ้าสะบัดแรงเกินจนค่าพิกัดระเบิดกลายเป็นเส้นแหลมทั้งจอ (NaN / Explosion)
  - ผ้าทะลุเสากระโดงเรือ
  - เรือลอยแข็งทื่อไม่เอียงตามคลื่น
check_en:
  - Does the cloth blow up into spikes across the frame from NaN positions?
  - Does the cloth pass through the mast?
  - Does the hull float rigidly instead of rolling and pitching with the waves?
---

Create a deterministic 16-second 3D ocean and cloth physics simulation saved as `storm_sails.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. Zero external 3D models or textures allowed.

Physics & Scene Requirements:

1. Ocean Surface: Build a high-resolution ocean mesh displaced by a sum of at least 6 directional Gerstner waves with analytical normals, foamy wave crests based on Jacobian folding, and deep sea Fresnel reflections.
2. Buoyant Ship Hull: Construct a procedural wooden galleon/schooner hull whose pitch, roll, and heave are dynamically calculated by sampling wave heights at 4 hull buoyancy points.
3. Verlet Cloth Simulation: Implement a custom Verlet integration mass-spring solver (structural, shear, and bending springs with sub-stepped distance constraints) for the ship's main square sail and masthead pennant flag. Apply gusting curl-noise wind forces and enforce sphere/capsule collision against the mast so cloth never passes through wood.
4. Camera & Rendering: Use a dramatic low-angle tracking camera mounted near the bow waves, spray particles kicking off the hull, and overcast stormy lighting. Render deterministically (`t = frame / 30`), inspect keyframe PNGs to verify cloth stability and zero mesh clipping, and encode to `storm_sails.mp4` (H.264, yuv420p).
