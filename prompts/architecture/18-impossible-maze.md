---
id: "18"
slug: impossible-maze
track: architecture
source: Gemini
title_th: เขาวงกตสถาปัตยกรรมที่เป็นไปไม่ได้สไตล์ Escher
title_en: Impossible Escher architecture and gravity shift
measures_th: วัดเรขาคณิตต่างระนาบ (Multi-planar) และการหมุนเวกเตอร์แรงโน้มถ่วงของตัวละครกับกล้องให้สอดประสาน
measures_en: Multi-planar geometry, with the camera's gravity vector rolling over without breaking
tags: Quaternion slerp, Gravity shift, AO, Long shadows
output: impossible_maze.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - เกิดอาการ Gimbal Lock ตอนหมุนกล้อง 90 องศา ทำให้ภาพตีลังกากระตุก
  - วัตถุเดินจมทะลุขั้นบันไดเมื่อเปลี่ยนระนาบแรงโน้มถ่วง
check_en:
  - Does the camera hit gimbal lock on the 90-degree roll and snap upside down?
  - Does the walker sink through the stairs when the gravity plane changes?
---

Build a mind-bending 16-second 3D Escher-inspired architectural animation rendered to `impossible_maze.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg.

Impossible Geometry & Gravity Choreography:

1. Multi-Gravity Architecture: Construct a surreal brutalist-pastel labyrinth inspired by M.C. Escher's *Relativity*, featuring interconnected staircases, archways, pillars, and water channels oriented along three perpendicular gravity axes (Floor, Wall, and Ceiling planes).
2. Continuous Traversal & Gravity Shifts:
   - Track a luminous crystalline polyhedron / mechanical walker rolling and climbing along a continuous closed path across the structure.
   - At two distinct transition points (around 5s and 11s), as the walker steps onto a perpendicular staircase landing, smoothly roll and pitch the camera's up-vector by 90 degrees (`quaternion.slerp`) so the former wall seamlessly becomes the new floor.
3. Visual Polish & Determinism: Light the scene with soft architectural daylight, ambient occlusion-like crevice shading, and long crisp shadows that reveal the multi-axis structure. Render deterministically (`t = frame / 30`), inspect keyframes before, during, and after each 90-degree camera roll to verify smooth orientation transitions, and encode `impossible_maze.mp4`.
