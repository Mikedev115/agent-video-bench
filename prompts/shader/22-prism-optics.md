---
id: "22"
slug: prism-optics
track: shader
source: Gemini
title_th: ปริซึมกระจายแสงและ caustics บนโต๊ะทดลอง
title_en: Dispersion prism and caustics lab
measures_th: วัดการเขียน Snell's law ตามความยาวคลื่นจริง (16 แถบ) และการสแกนหา NaN
measures_en: Wavelength-dependent Snell refraction over 16 bands, with a NaN scan
tags: Spectral refraction, Volumetrics, Caustics, Bloom
output: prism_optics.mp4
duration: 12
fps: 30
resolution: 1920x1080
check_th:
  - สเปกตรัมเป็นแถบสีแบน ๆ ไม่ต่อเนื่อง (ใช้ RGB 3 แทน 16 แถบ)
  - สีแต่ละความยาวคลื่นหักเหมุมเท่ากัน หรือรวมกลับผิดตำแหน่งบนฉากรับแสง
  - จุด caustics กระพริบเป็นช่วง ๆ หรือมีจุดขาวดำจาก NaN
check_en:
  - Is the spectrum flat and banded instead of continuous (RGB standing in for 16 bands)?
  - Do all wavelengths bend the same amount, or refocus to the wrong spot on the screen?
  - Do the caustics flicker frame to frame, or show black and white NaN speckles?
---

Create a deterministic 12-second 3D optical simulation rendered to `prism_optics.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js on WebGL2 with custom GLSL in headless Chromium, encoded with FFmpeg. Zero external assets.

Tech: `uTime = frame / 30` per frame, one seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta, 360 frames. The beam is traced in the shader (or as 16 analytic ray polylines), never faked with a pre-made rainbow gradient texture.

Optics, computed for real: a collimated white beam leaves an anodized aluminium emitter and strikes a rotating equilateral flint-glass prism. Evaluate Snell's law per wavelength across 16 bands from 400 nm to 700 nm with the glass index running 1.68 (violet) to 1.62 (red). Downstream, a biconvex lens and a parabolic mirror refocus and fold the dispersed beams onto a matte calibration screen; the caustic pattern must move as the prism rotates, not merely brighten.

Choreography:
- 0-4s: slow dolly along the beam axis from the emitter, the prism turning into the beam.
- 4-8s: tilt up to reveal the full fan crossing the bench; the lens and mirror fold it toward the screen.
- 8-12s: the screen comes into focus, caustics crawling across it; shallow DOF held on the prism.

Materials & atmosphere: dark optical breadboard with an M6 hole grid and crisp reflections, faint volumetric dust motes catching the beams, bloom only on beam cores. Style: laboratory instrument study - black, glass, and pure spectral colour, no on-screen text.

Deliverables & gates:
1. `frames/` (360 PNGs), `prism_optics.mp4`, `contact-sheet.png`, `nan-scan.log`.
2. NaN gate: scan every rendered frame for NaN/Inf pixels and for any pixel above the clamp; a single hit fails the run.
3. Spectrum gate: on frame 240, sample the beam fan and confirm at least six distinguishable hues between the prism exit and the screen - log the sampled hex values.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 180.
5. ffprobe: 12.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes; a flickering frame is a failure, not a style choice.
