---
id: "26"
slug: pathfinding-race
track: world
source: Gemini
title_th: แข่งอัลกอริทึมหาเส้นทางในเขาวงกต 3 มิติ
title_en: A* versus Dijkstra pathfinding race
measures_th: วัดการทำอัลกอริทึมจริงบนกริด 3 มิติ และภาพที่ต้องสะท้อนจำนวนโหนดที่เยี่ยมชมตามจริง
measures_en: Real graph search on a 3D grid, with the visuals bound to the true visited counts
tags: Dijkstra, A*, Volumetric voxels, HUD counters
output: pathfinding_race.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - A* กับ Dijkstra เยี่ยมชมจำนวนโหนดเท่ากัน (heuristic ไม่ได้ทำงานหรือไม่ admissible)
  - เส้นทางที่ได้ตัดผ่านกำแพง หรือยาวกว่าค่า optimal ที่คำนวณไว้
  - ตัวนับโหนดบนจอไม่ตรงกับจำนวน voxel ที่ขึ้นจริงในเฟรม
check_en:
  - Do A* and Dijkstra visit the same number of nodes, meaning the heuristic does nothing?
  - Does the returned path cut through walls, or run longer than the computed optimum?
  - Do the on-screen counters disagree with the number of voxels actually drawn?
---

Create a deterministic 15-second 3D algorithm visualisation rendered to `pathfinding_race.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external assets.

Tech: `t = frame / 30`, one seeded PRNG (`mulberry32(1337)`) for maze generation, no `Math.random()`, no wall-clock delta, 450 frames. Run both searches for real over a `21 x 21 x 3` cell grid with spiral ramps and bridges between floors - never replay a hand-authored list of visited cells.

Required behaviour:
- Dijkstra expands uniformly by cost; A* uses an admissible heuristic (3D Euclidean to the goal, weighted 1.0). Both must run on the same obstacle grid and finish.
- A* must visit strictly fewer nodes than Dijkstra, by at least 20%. Log both counts and the path cost to stdout.
- Both searches must return paths of the same optimal cost; assert equality and fail loudly if not.
- Every visited node is drawn as a translucent voxel that rises 0.15 s after it is expanded: cobalt for Dijkstra, emerald for A*. The number of voxels on screen at any frame must equal the logged visited count for that frame.

Choreography:
- 0-2s: the labyrinth establishes, camera drifting over the three floors, start (green) and goal (gold) beacons lit.
- 2-10s: both waves expand simultaneously; the camera tracks the frontier, tilting between floors.
- 10-15s: the winning path is traced as a glowing neon-gold spline and the camera flies along it to the goal.

Visual style: technical explainer - concrete and frosted glass labyrinth, emissive vapours only for the search waves and the HUD, floating world-space counters in monospace, no on-screen paragraph text.

Deliverables & gates:
1. `frames/` (450 PNGs), `pathfinding_race.mp4`, `contact-sheet.png`, `search.log`.
2. Heuristic gate: A* visited count at least 20% below Dijkstra's.
3. Optimality gate: identical path costs; no path segment may cross an obstacle cell (assert against the grid).
4. Visual-data gate: voxel count on screen equals the logged visited count for the sampled frames.
5. Determinism gate: two renders from the same seed, identical sha256 for frame 225.
6. ffprobe: 15.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes.
