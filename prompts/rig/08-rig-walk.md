---
id: "08"
slug: rig-walk
track: rig
source: Aetox
title_th: ท่าเดินจากริกที่สร้างเอง
title_en: Procedural walk cycle
measures_th: วัดน้ำหนัก skin, IK ขาสองท่อน และการยึดเท้ากับพื้น
measures_en: Skinning weights, two-bone IK and contact with the ground
tags: SkinnedMesh, Two-bone IK, Verlet, Loop
output: rig_walk.mp4
duration: 12
fps: 30
resolution: 1920x1080
check_th:
  - เท้าไถลบนพื้นในจังหวะที่ควรยึดอยู่กับที่
  - เข่างอผิดทิศหรือกระตุก (knee pop)
  - ตัวละครจมลงพื้น หรือบิดเป็นเกลียวที่ไหล่ (candy wrapper)
  - เฟรมสุดท้ายไม่ตรงกับเฟรมแรกจนวนลูปไม่เนียน
check_en:
  - Do the feet slide on the floor while they are planted?
  - Does the knee pop or bend backwards?
  - Does the mesh sink into the ground, or twist like a candy wrapper at the shoulder?
  - Does the last frame match the first one so the clip loops?
---

Create a deterministic 3D walking character rendered to `rig_walk.mp4` (1920x1080, 30 FPS, 12 seconds) using Three.js `Skeleton` + `SkinnedMesh`, headless Chromium, and FFmpeg. The character must be built procedurally (primitive parts merged into one skinned mesh) - no GLTF, no external rigs, no motion capture data.

Rig & Kinematics:

1. Build a 20-bone humanoid skeleton (pelvis, 3 spine bones, neck, head, two 4-bone arms, two 4-bone legs) and bake smooth skin weights from bone distances, normalised so every vertex's weights sum to 1.0.
2. Procedural walk: drive the cycle from `phase = t * cadence` with sine-based hip, knee and ankle curves. The feet MUST stay planted - solve two-bone IK per leg against a world-space foot target, and during stance the support foot's world position must not drift more than 1 mm. Log the worst drift across all frames.
3. Secondary motion: spine counter-rotation, arms swinging in opposite phase to the legs, and a 12-bone tail lagging the hips by about 0.15 s (verlet chain).
4. Ground contact: no vertex may go below `y = 0` (assert every frame), and the character must advance at exactly the speed the stance foot travels backwards - no moonwalking.
5. Rendering: bronze clay material, three-point lighting, a soft contact shadow on the floor, and a slow 120-degree camera orbit with cubic easing.
6. Verify: sample frames across the clip and confirm no foot sliding, knee angle stays within 0-150 degrees (no hyperextension pop), no candy-wrapper twist at the shoulders, and the last frame's pose matches frame 0 within 1 cm so the clip loops.
