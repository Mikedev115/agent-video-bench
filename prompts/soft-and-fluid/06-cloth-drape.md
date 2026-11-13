---
id: "06"
slug: cloth-drape
track: soft-and-fluid
source: Aetox
title_th: ผ้าไหมคลุมโครงโลหะ
title_en: Silk cloth over an armature
measures_th: วัดตัวแก้ soft body, การชนกันเองของผ้า และการทรงตัวตอนนิ่ง
measures_en: Soft-body solver, self-collision and stable draping
tags: XPBD, Self-collision, Cloth shader, Seeded
output: cloth_drape.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - ผ้าทะลุผ่านโครงโลหะ
  - รอยพับซ้อนกันแล้วทะลุเข้าหากัน
  - ผ้าสั่นไม่หยุดตอนควรจะนิ่ง หรือขอบที่ปักหมุดถูกดึงจนยืด
check_en:
  - Does the cloth pass through the armature?
  - Do the folds pass through each other when they stack?
  - Does the cloth keep jittering instead of settling, or do the pinned edges tear?
---

Create a deterministic 3D cloth simulation rendered to `cloth_drape.mp4` (1920x1080, 30 FPS, 16 seconds) using Three.js, a position-based solver (XPBD, self-written), headless Chromium, and FFmpeg. Zero external meshes or textures.

Scene & Physical Requirements:

1. Build a 44x44 particle grid of silk (1,936 vertices, distance + bending constraints), pinned at two corners, dropped onto a slowly rotating bronze armature (one torus knot and three cylinders) in a dark studio.
2. Solver: XPBD at 20 substeps per video frame with `dt = (1/30) / 20`, plus a self-collision pass using spatial hashing with particle radius equal to the cloth thickness. A three-octave noise wind field ramps in at second 6.
3. The cloth MUST drape over and slide off the armature without passing through it. Collide against an analytic proxy of the armature (sphere/capsule tests per vertex), and assert every frame that no vertex is inside the proxy - log `MAX_PENETRATION` to stdout, it must stay 0.
4. Materials: two-sided fabric shader with anisotropic sheen, micro-weave normal detail generated in the shader from UV (no texture files), and a warm subsurface tint on the back face. Lit by a procedural studio environment (PMREMGenerator) plus one key light casting the cloth's self-shadow onto the floor.
5. Determinism: every random value from one seeded PRNG, `t = frame / 30`, no `Math.random()`, no wall-clock delta. Encode H.264 yuv420p.
6. Verify from extracted keyframe PNGs: the cloth never passes through itself at the folds, no stretched triangles (every edge length stays within 90-110% of rest length), and the silhouette settles without jitter over the final 3 seconds.
