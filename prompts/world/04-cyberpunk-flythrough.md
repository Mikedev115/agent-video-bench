---
id: "04"
slug: cyberpunk-flythrough
track: world
source: Gemini
title_th: บินสำรวจมหานคร Cyberpunk ยามค่ำคืน
title_en: Cyberpunk megacity flythrough
measures_th: วัดการจัดการ Scene ขนาดใหญ่ & Post-Processing
measures_en: Large-scene optimisation and post-processing
tags: InstancedMesh, Bloom, Spline, Canvas2D
output: cyberpunk_flythrough.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - กล้องบินทะลุตึก
  - แสง Bloom ฟุ้งจนขาวโพลนทั้งจอ
  - เฟรมเรตตกจนภาพกระตุกหากเอเจนไม่ได้ล็อกเวลาแบบ Deterministic
check_en:
  - Does the camera fly through a building?
  - Is the bloom blown out until the whole frame is white?
  - Does the frame rate drop far enough to make the motion stutter?
---

Build a procedural 3D Cyberpunk Megacity flythrough rendered to `cyberpunk_flythrough.mp4` (1920x1080, 30 FPS, 16 seconds) using Three.js, EffectComposer post-processing, headless Chromium, and FFmpeg. Zero external assets allowed.

Scene & Technical Architecture:

1. Procedural Cityscape: Generate 400+ multi-tiered skyscrapers using `THREE.InstancedMesh` with varied setbacks, rooftop antennas, holographic billboards, and procedurally generated high-res Canvas2D emissive window/neon textures (avoid uniform random noise; group lit windows into realistic office floors).
2. Atmosphere & Traffic: Add exponential volumetric-style height fog, wet reflective street surfaces, 150 flying hover-cars moving along multi-level aerial lanes with glowing light trails, and rain streaks.
3. Post-Processing & Camera: Use `UnrealBloomPass` tuned so neon signs glow without blowing out building details. Fly the camera along a `CatmullRomCurve3` weaving between towers, diving down to street level, and banking through a neon-lit canyon - mathematically guaranteeing the spline stays outside all building bounding boxes.
4. Render deterministically per frame and verify visual clarity via keyframe screenshots before encoding `cyberpunk_flythrough.mp4`.
