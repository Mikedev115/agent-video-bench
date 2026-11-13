---
id: "11"
slug: water-ripples
track: soft-and-fluid
source: Gemini
title_th: สวนน้ำไผ่กระดกและคลื่นผิวน้ำสมการ PDE
title_en: Zen water garden ripples from a PDE heightfield
measures_th: วัดการแก้สมการคลื่นผิวน้ำ (2D Wave Equation) บน Grid พร้อมแสงหักเหใต้ผิวน้ำ
measures_en: A 2D wave-equation heightfield solved per substep, with underwater caustics
tags: Wave equation, CFL, Heightfield, Caustics
output: water_ripples.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - สมการคลื่นแตกเป็นตารางหมากรุกขาวดำเพราะตั้ง Timestep ผิดเงื่อนไข CFL
  - กระบอกไม้ไผ่ไม่กระดกตามจังหวะน้ำเต็ม
  - ผิวน้ำไม่มีเงาสะท้อน
check_en:
  - Does the wave field break into a black-and-white checkerboard from a CFL-violating timestep?
  - Does the bamboo rocker never tip when it fills?
  - Is the water surface missing its reflections?
---

Generate a 16-second tranquil yet technically complex 3D Zen water garden animation `water_ripples.mp4` (1920x1080, 30 FPS) using Three.js, custom GLSL shaders, headless Chromium, and FFmpeg.

Simulation & Scene Mechanics:

1. Real-Time Wave Equation Solver: Implement a 256x256 2D shallow-water heightfield simulation (`u[x][y]`) updated deterministically per substep (respecting the Courant-Friedrichs-Lewy stability condition). Displace the pond surface mesh and compute real-time surface normals from height gradients.
2. Mechanical Trigger (Shishi-odoshi): Build a procedural bamboo water fountain pouring a continuous stream of water particles into a pivoted bamboo rocker tube. As the tube fills, its center of mass shifts, causing it to tip forward, dump water into the pond (injecting radial impulse waves into the heightfield), and clack back onto a stone rest.
3. Optical Caustics & Environment: Project animated Voronoi/gradient-based caustic light patterns onto submerged smooth river stones and koi fish silhouettes beneath the water surface, surrounded by procedural moss rocks and maple leaves.
4. Render frame-by-frame deterministically (`t = frame / 30`), inspect keyframe PNGs for wave reflection and refraction quality, and encode to `water_ripples.mp4`.
