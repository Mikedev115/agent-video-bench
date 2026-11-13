---
id: "27"
slug: terrarium-succession
track: world
source: Gemini
title_th: ภาชนะแก้วก้นจัตุรัสและลำดับการเติบโตของระบบนิเวศ
title_en: Terrarium ecological succession
measures_th: วัดการเติบโตแบบ procedural ตามช่วงเวลา (L-system) ที่ต้องไม่ข้ามลำดับและไม่ทะลุขอบภาชนะ
measures_en: Procedural growth in staged order, never skipping a stage nor breaching the container
tags: L-system, Cross-section, Staged growth, Volumetric light
output: terrarium_succession.mp4
duration: 20
fps: 30
resolution: 1920x1080
check_th:
  - ต้นไม้โผล่ก่อนชั้นดินจะหนา หรือขั้นที่ 2 ยังไม่จบขั้นที่ 3 เริ่มแล้ว
  - รากหรือง่ากทะลุออกนอกกล่องแก้ว
  - จำนวนใบ/ยอดไม่เพิ่มขึ้นตามเวลา หรือฉากจบไม่มีเรย์แสง volumetric จากหลังคาป่า
check_en:
  - Do trees appear before the soil thickens, or does stage 3 start before stage 2 finishes?
  - Do roots or branches grow through the glass?
  - Does the leaf and shoot count fail to increase over time, or is the final canopy missing its volumetric light shafts?
---

Create a deterministic 20-second 3D time-lapse diorama rendered to `terrarium_succession.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external models, textures or audio.

Tech: `t = frame / 30`, one seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta, 600 frames. All growth is generated from the same seed every run, so plant positions and leaf counts are reproducible.

Scene: a beveled glass cube, cross-sectioned, floating against a clean studio backdrop. Visible soil strata on the cut faces - basalt bedrock, clay, rich topsoil - with an underground water table that rises across the clip and feeds a surface stream.

Staged growth, strictly ordered and gated by `t`:
- 0-5s pioneer: barren cooled lava, mist and rain droplets; procedural moss and lichen spread across the rock faces (coverage 0 to ~15%).
- 5-10s herbaceous: the soil layer thickens; grasses, ferns and wildflowers sprout and sway in a light breeze.
- 10-15s shrub and sapling: recursive L-system or space-colonisation trees branch upward, canopies unfurling, while the stream carves through the centre into a clear pond.
- 15-20s climax: full canopy, dappled volumetric sunlight through the leaves, fireflies and pollen drifting, warm golden-hour grade while the camera completes a 360-degree showcase orbit.

Constraints: no root or branch may exit the glass - assert every vertex against the cube bounds each frame and log the worst overshoot (must be 0). Leaf count must be monotonically non-decreasing and logged per second.

Visual style: museum diorama - clean glass, rich earth, soft depth of field on the front face, restrained colour that warms toward the end, no on-screen text.

Deliverables & gates:
1. `frames/` (600 PNGs), `terrarium_succession.mp4`, `contact-sheet.png`, `growth.csv` (leaf count, canopy coverage, water level per second).
2. Ordering gate: each stage's growth metric must be flat inside every other stage's window - no trees in the herbaceous window.
3. Bounds gate: root and branch overshoot stays 0 on every frame.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 420.
5. ffprobe: 20.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes.
