---
id: "01"
slug: tourbillon
track: mechanics
source: Gemini
title_th: กลไกนาฬิกา Tourbillon
title_en: Tourbillon movement
measures_th: วัดความแม่นยำคณิตศาสตร์ 3 มิติ & อัตราทดเฟือง
measures_en: 3D spatial reasoning and gear-train ratios
tags: Three.js, Kinematics, PBR, Macro
output: tourbillon.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - ดูจังหวะฟันเฟืองที่ขบกันในเฟรม Macro ว่าฟันเฟืองซ้อนทับ (Clip) กันหรือไม่
  - ดูเงาตกกระทบบนแผ่นเพลทโลหะ และทิศทางการหมุนว่าตรงกับหลักฟิสิกส์หรือไม่
check_en:
  - In the macro frame, do the gear teeth overlap (clip) instead of meshing?
  - Do the shadows land correctly on the plate, and do the gears turn the way physics says?
---

Build a 100% procedural 3D animation rendered to `tourbillon.mp4` (1920x1080, 30 FPS, 15 seconds) using Three.js, headless Chromium (Puppeteer/Playwright), and FFmpeg. Do NOT use external 3D models or textures.

Scene & Engineering Requirements:

1. Construct an intricate mechanical skeleton watch Tourbillon movement with at least 6 interlocking spur gears of varying tooth counts, a central balance wheel oscillating sinusoidally, an escapement lever, a coiled mainspring, and metallic bridges with ruby jewel bearings.
2. Exact Kinematics: Every meshing gear pair MUST have aligned pitch circles and exact angular velocity ratios ($\omega_1 / \omega_2 = -N_2 / N_1$) with phase offsets so gear teeth never intersect or clip through each other.
3. Materials & Lighting: Physically based metallic shaders (brushed brass, polished steel, synthetic ruby translucency) lit by a procedural studio environment map (PMREMGenerator) and three-point directional lights casting crisp self-shadows.
4. Camera & Rendering: Smoothly transition from a wide angled view to an extreme macro close-up of the escapement mechanism using cubic easing. Render deterministically frame-by-frame (`t = frame / 30`) so there is zero frame drop, encode via FFmpeg (H.264, yuv420p), and inspect extracted keyframe PNGs to verify zero mesh clipping before finishing.
