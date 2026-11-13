---
id: "14"
slug: gothic-cathedral
track: architecture
source: Gemini
title_th: วิหารโกธิคผุดขึ้นจากความว่างเปล่า
title_en: Gothic cathedral assembly
measures_th: วัดความแม่นยำเรขาคณิตสถาปัตยกรรม (เสา วงโค้งปลายแหลม ค้ำยันลอย หน้าต่างกุหลาบ) และคิวประกอบจากฐานสู่ยอด
measures_en: Architectural geometry - piers, pointed arches, flying buttresses, rose window - with a build order from base to spire
tags: Procedural geometry, Staggered build, Stained glass, Staging
output: gothic_cathedral.mp4
duration: 18
fps: 30
resolution: 1920x1080
check_th:
  - ค้ำยันลอย (Flying buttresses) ลอยค้างกลางอากาศไม่ชนกับผนังเสา
  - คิวประกอบชิ้นส่วนผิดลำดับ (หลังคามาก่อนเสา)
  - หน้าต่างกุหลาบซ้อนทับจนเกิดรอยกระพริบ (Z-fighting)
check_en:
  - Do the flying buttresses hang in the air without ever meeting the piers?
  - Is the build order wrong, with the roof arriving before the columns?
  - Does the rose window overlap itself and flicker with Z-fighting?
---

Create a deterministic 18-second 3D architectural assembly animation saved as `gothic_cathedral.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. Zero external 3D models or textures allowed.

Architecture & Assembly Choreography:

1. Procedural Gothic Geometry: Construct a detailed Gothic cathedral nave and facade featuring clustered piers, pointed lancet arches, quadripartite rib vaults, external flying buttresses, steep gabled roofs, a central spire, and a intricate radial rose window with procedural stained-glass emissive shaders.
2. Staggered Construction Sequence:
   - (0-4s) Stone foundation plinths and clustered columns rise from the ground with cubic-out easing and subtle dust bursts.
   - (4-9s) Pointed arches, side aisles, and exterior flying buttresses fly into place symmetrically along the nave axis.
   - (9-14s) Ribbed ceiling vaults weave together overhead, followed by the facade towers and central spire locking into place.
   - (14-18s) Warm golden interior lights ignite, casting colorful stained-glass caustics/beams across the stone floor as the rose window illuminates.
3. Camera & Rendering: Orbit smoothly from a low-angle three-quarter exterior view up toward the spire, then glide through the main portal into the illuminated nave. Render deterministically (`t = frame / 30`), inspect keyframe PNGs for symmetry and alignment, and encode to `gothic_cathedral.mp4` (H.264, yuv420p).
