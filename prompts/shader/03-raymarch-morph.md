---
id: "03"
slug: raymarch-morph
track: shader
source: Gemini
title_th: โลหะเหลวเปลี่ยนรูปด้วย Raymarching Fractal
title_en: Fractal raymarch morph
measures_th: วัดการเขียน GLSL Shader & แสงเงาขั้นสูง
measures_en: Hand-written GLSL and advanced lighting
tags: GLSL, SDF, Raymarching, WebGL2
output: raymarch_morph.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - ขอบวัตถุเป็นขั้นบันได (Raymarching step artifact)
  - แสงสะท้อนแตกเป็นจุดขาวดำ (NaN values)
  - กล้องพุ่งทะลุเข้าไปในเนื้อวัตถุจนจอมืด
check_en:
  - Are object edges stair-stepped (raymarching step artifacts)?
  - Do reflections break into black or white speckles (NaN values)?
  - Does the camera fly into the surface until the frame goes black?
---

Generate a 15-second 3D Raymarched GLSL Shader video saved as `raymarch_morph.mp4` (1920x1080, 30 FPS) using WebGL2 / Three.js `ShaderMaterial`, headless Chromium, and FFmpeg. No standard 3D polygon meshes allowed - the entire scene must be rendered via fragment shader raymarching.

Visual & Math Specifications:

1. Core Subject: Smoothly morph (`smoothstep` + domain repetition/blending) between a 3D Mandelbulb fractal, a gyroid lattice sphere, and orbiting ferrofluid droplets using smooth-minimum (`smin`) SDF operations.
2. Rendering Pipeline: Implement analytical/central-difference surface normals, soft penumbra shadows, ambient occlusion (AO), Fresnel iridescent chrome reflections, and exponential distance fog.
3. Camera Choreography: Fly the ray origin along a collision-free parametric path around and partially through the gyroid cavities without clipping inside solid SDF geometry (enforce a minimum SDF distance safety clamp on the camera).
4. Render deterministically by passing exact `uTime = frame / 30.0` uniforms per frame, capture lossless frames, compile with FFmpeg (`crf 18`), and inspect rendered frames to ensure zero raymarching banding or NaN pixel artifacts.
