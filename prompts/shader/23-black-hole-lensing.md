---
id: "23"
slug: black-hole-lensing
track: shader
source: Gemini
title_th: หลุมดำและการหักเหแสงเชิงสัมพัทธภาพ
title_en: Relativistic black hole lensing
measures_th: วัดการอินทิเกรตวิถีแสงโค้งในเรขาคณิต Schwarzschild ด้วย GLSL raymarching
measures_en: Curved null-geodesic integration around a Schwarzschild horizon, in GLSL
tags: Geodesic RK4, Accretion disk, Doppler beaming, Volumetric noise
output: black_hole.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - เงามืดของหลุมดำไม่กลม หรือรัศมีไม่คงที่ตามที่ Schwarzschild ให้ (~2.6 Rs)
  - แหวน Einstein ขาด ตอนแสงจากด้านหลังไม่โค้งข้ามขอบบนและล่าง
  - ดวงดาวพื้นหลังไม่บิดเบี้ยวเมื่อกล้องเคลื่อน หรือจาน accretions หมุนผิดข้างและ Doppler กลับสี
check_en:
  - Is the shadow non-circular, or does its radius drift away from the Schwarzschild ~2.6 Rs?
  - Is the Einstein ring broken, with light from behind failing to arc over the top and bottom?
  - Does the starfield stay undistorted as the camera moves, or the disk spin the wrong way with Doppler inverted?
---

Create a deterministic 15-second 3D astrophysical film rendered to `black_hole.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using a custom GLSL raymarcher on WebGL2 (Three.js `ShaderMaterial`) in headless Chromium, encoded with FFmpeg. No polygon meshes for the hole, disk or sky - the whole frame is a fragment shader.

Tech: `uTime = frame / 30`, one seeded PRNG (`mulberry32(1337)`) feeding the noise, no `Math.random()`, no wall-clock delta, 450 frames. Integrate each ray with RK4 in the Schwarzschild metric (units `Rs = 1`), step size adapted so the error stays below 1e-3 per ray, and cap the step count per pixel so cost is bounded.

Physically required, not decorative:
- The event-horizon shadow must render at radius 2.6 Rs and stay circular to within 1.5% of its radius across the whole clip.
- The accretion disk runs Keplerian angular velocity `omega = r^-1.5` from 3 Rs to 12 Rs, with FBM filaments shearing in the flow.
- Doppler beaming plus gravitational redshift: the approaching side is brighter and blue-white, the receding side dimmer and red-orange, and the shift must track the actual velocity, not a hand-painted gradient.
- A background starfield (procedural, seeded) must visibly warp and streak as the camera moves; lensing distortion is the point of the shot.

Choreography: 0-5s equatorial wide; 5-11s inclined flyby sweeping past the photon sphere; 11-15s pull back to a high-angle overview.

Visual style: astrophysical plate - black sky, hot disk, thin volumetric glow, restrained bloom, no lens flares invented for effect, no on-screen text.

Deliverables & gates:
1. `frames/` (450 PNGs), `black_hole.mp4`, `contact-sheet.png`, `gates.log`.
2. Shadow gate: measure the shadow radius on frames 30, 225 and 420; the spread must stay under 1.5%.
3. NaN gate: scan every frame for NaN/Inf; one hit fails the run.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 225.
5. ffprobe: 15.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes. Banding, a frozen disk or a black frame is a failure, not a look.
