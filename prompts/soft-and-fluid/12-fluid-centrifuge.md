---
id: "12"
slug: fluid-centrifuge
track: soft-and-fluid
source: Gemini
title_th: ของเหลวหนืดในตู้กระจกหมุนเหวี่ยง
title_en: Viscous fluid in a spinning glass tank
measures_th: วัดสมการพลศาสตร์ของไหลแบบอนุภาค 3 มิติ (SPH/PBF) บนภาชนะที่หมุนไปมา
measures_en: A 3D particle fluid solver held inside a container that keeps spinning
tags: PBF / SPH, Spatial hash, Vorticity, Marching cubes
output: fluid_centrifuge.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - อนุภาคน้ำทะลุกระจกหลุดออกไปนอกตู้ตอนหมุนเร็ว ๆ
  - ของเหลวระเบิดกระจายเพราะค่าแรงดัน (Pressure stiffness) สูงเกินไป
  - น้ำกองแบนติดพื้นไม่รวมตัวเป็นปริมาตร
check_en:
  - Do particles tunnel through the glass when the spin gets fast?
  - Does the fluid explode because the pressure stiffness is too high?
  - Does the water flatten into a puddle instead of holding volume?
---

Create a deterministic 15-second 3D particle fluid simulation exported to `fluid_centrifuge.mp4` (1920x1080, 30 FPS) using Three.js, a custom 3D Position-Based Fluids (PBF) or Smoothed Particle Hydrodynamics (SPH) solver, headless Chromium, and FFmpeg.

Fluid & Container Requirements:

1. Fluid Solver: Simulate at least 4,000 interacting 3D fluid particles with spatial hash grid neighbor search, density/incompressibility constraints, XSPH viscosity, and vorticity confinement.
2. Dynamic Container & Obstacles: Confine the fluid inside a tilted transparent glass prism/cylinder containing internal baffle fins. Rotate the container smoothly with accelerating and reversing angular velocity so the liquid sloshes, climbs the walls, splashes over the baffles, and settles.
3. Surface Rendering: Render the fluid cleanly using either real-time Marching Cubes surface extraction or instanced glossy metaball/screen-space refracting spheres with depth-based absorption coloring (turquoise to deep cobalt) and studio rim lighting.
4. Render deterministically with sub-stepped physics (`1/180s`), inspect keyframes at peak splash and settled states to verify zero particle tunneling outside the glass walls, and encode `fluid_centrifuge.mp4`.
