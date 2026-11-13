---
id: "25"
slug: subsea-cables
track: world
source: Gemini
title_th: สายเคเบิลใต้ทะเลและเส้นทางสำรองเมื่อสายขาด
title_en: Subsea cable traffic and outage reroute
measures_th: วัด data-viz เชิงพื้นที่พร้อมเหตุการณ์เป็นช่วง และตัวเลข HUD ที่ต้องตรงกับสถานะจริง
measures_en: Geospatial data-viz with staged events, where the HUD must match the simulation
tags: Great-circle splines, Packet pulses, Event staging, HUD telemetry
output: subsea_cables.mp4
duration: 18
fps: 30
resolution: 1920x1080
check_th:
  - สายเคเบิลลอยพ้นผิวโลกหรือจมทะลุเข้าไปในลูกโลก
  - แพ็กเก็ตวิ่งขาดตอนหรือไม่หยุดเมื่อสายถูกตัด และไม่ย้ายไปเส้นทางสำรอง
  - ตัวเลขบน HUD (latency, throughput) ไม่เปลี่ยนตามเหตุการณ์ หรือไม่ตรงกับค่าที่บันทึกไว้
check_en:
  - Do the cables float off the globe's surface or sink into it?
  - Do packets keep flowing on a severed cable, or fail to move onto the alternate routes?
  - Does the HUD (latency, throughput) stay flat, or disagree with the logged values?
---

Create a deterministic 18-second 3D data-visualisation rendered to `subsea_cables.mp4` (1920x1080, 30 FPS, H.264 yuv420p) using Three.js in headless Chromium and FFmpeg. Zero external models, textures or map data files.

Tech: `t = frame / 30`, one seeded PRNG (`mulberry32(1337)`), no `Math.random()`, no wall-clock delta, 540 frames. The routing model is a small graph the renderer reads from, so the picture can never disagree with the numbers.

Scene: a dark obsidian globe with glowing bathymetric contours and major landing stations (Tokyo, Singapore, Los Angeles, New York, London, Marseille). Draw 20+ cables as great-circle splines lifted just off the surface - every cable vertex must sit within 0.5% of the sphere radius, none floating or sunk. Data packets travel the splines as luminous pulses, density proportional to the load on that cable.

Event timeline:
- 0-6s: normal global traffic, camera orbiting from a Pacific view toward the Atlantic.
- 6-10s: a seismic fault off Luzon flashes red and severs three trunk cables; those segments turn crimson and their packets stop within 0.3 s.
- 10-18s: rerouting. Traffic surges onto the southern and trans-Arctic alternates (amber under load, cyan at rest) with throughput on those routes rising at least 30% within 2 s of the cut. A minimal HUD reports latency in ms and throughput in Tbps, updated per frame from the same numbers you log.

Camera: slow orbital drift with one push-in toward the severed corridor during the outage, easing back out for the recovery.

Visual style: mission-control dark mode - deep navy and black, thin luminous lines, one accent for failure (red) and one for recovery (amber), monospace HUD, no decorative chrome.

Deliverables & gates:
1. `frames/` (540 PNGs), `subsea_cables.mp4`, `contact-sheet.png`, `traffic.csv` (per-frame throughput per cable family).
2. Routing gate: after the cut, traffic on the three severed cables must read exactly 0 and the alternate families must rise at least 30%.
3. Geometry gate: assert every cable vertex's radius error stays under 0.5%.
4. Determinism gate: two renders from the same seed, identical sha256 for frame 300.
5. ffprobe: 18.00 +/- 0.10 s, 1920x1080, 30/1, yuv420p.

Re-render until every gate passes; a HUD that drifts from the data is a failed job.
