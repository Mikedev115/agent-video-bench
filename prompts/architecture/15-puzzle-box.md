---
id: "15"
slug: puzzle-box
track: architecture
source: Gemini
title_th: กล่องกลไกปริศนาแปลงร่างสไตล์ Steampunk
title_en: Transforming steampunk puzzle box
measures_th: วัดลำดับชั้น Parent-Child (THREE.Group), จุดหมุน (Pivot) และการเปิดกลไกหลายชั้นโดยไม่ให้แผ่นโลหะชนกัน
measures_en: Parent-child hierarchy, pivot placement, and a multi-layer unfolding with no plate intersecting another
tags: THREE.Group, Pivots, PBR wood, Macro camera
output: puzzle_box.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - จุดหมุน (Pivot) ของฝาพับอยู่ตรงกลางแผ่นแทนที่จะอยู่ที่ขอบบานพับ ทำให้แผ่นโลหะหมุนควงทะลุตัวกล่อง
  - แผ่นเกียร์ชั้นในกางออกแล้วชนหรือทะลุแผงไม้ชั้นนอก
check_en:
  - Does the lid pivot sit in the middle of the plate instead of on the hinge edge, so the plate swings through the box?
  - Do the inner gear plates collide with or pass through the outer mahogany panels?
---

Build a 16-second intricate 3D mechanical transformation animation rendered to `puzzle_box.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. Everything must be procedurally generated.

Mechanical Rigging & Transformation Stages:

1. Initial State: A richly detailed ornate brass, mahogany, and obsidian cube resting on a velvet-lined dark studio pedestal, featuring engraved relief patterns, corner brackets, and recessed combination dials.
2. Multi-Stage Unfolding Sequence:
   - (0-4s) Combination rings on the front face rotate sequentially to align markings; locking pins retract with crisp spring damping.
   - (4-9s) The four outer mahogany walls hinge outward 90 degrees like flower petals while corner brackets split and telescope along local axes.
   - (9-13s) Secondary brass gear plates unfold upward and outward via multi-pivot linkage arms, revealing an inner skeletal framework without any self-intersection.
   - (13-16s) A suspended glowing cyan/amber celestial astrolabe core rises from the center with counter-rotating gimbal rings.
3. Materials & Camera: Use PBR metallic/wood shaders with procedural normal/roughness maps via Canvas2D. Push the camera smoothly from a medium view into a tight macro angle tracking the unfolding layers. Render deterministically (`t = frame / 30`), verify keyframe PNGs for zero mesh intersection during unfolding, and compile `puzzle_box.mp4`.
