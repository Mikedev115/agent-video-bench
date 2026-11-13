---
id: "17"
slug: orbital-station
track: architecture
source: Gemini
title_th: สถานีอวกาศวงแหวนประกอบร่างในวงโคจร
title_en: Orbital station assembly and docking
measures_th: วัดการเคลื่อนที่ในสภาวะไร้น้ำหนัก การกางแผงโซลาร์แบบหีบเพลง และการเชื่อมต่อโมดูลด้วยแขนกล
measures_en: Zero-g motion, accordion solar-array kinematics, and docking with a robotic arm
tags: RCS particles, Robot arm, Accordion hinges, Earthshine
output: orbital_station.mp4
duration: 18
fps: 30
resolution: 1920x1080
check_th:
  - แผงโซลาร์เซลล์กางออกผิดทิศทางจนพับซ้อนทับกันเอง
  - วงแหวนหมุนรอบแกนที่เบี้ยว (Off-center pivot)
  - โมดูลวิ่งชนกันก่อนล็อก
check_en:
  - Do the solar wings unfold the wrong way and fold over themselves?
  - Does the ring spin around an off-centre pivot?
  - Do the modules collide before they lock?
---

Create a deterministic 18-second hard-surface sci-fi space assembly video `orbital_station.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. Zero external models or textures allowed.

Spacecraft & Assembly Sequence:

1. Modular Components: Construct a central spine truss, a pressurized habitation module, a large centrifugal habitation ring with radiating spokes, and multi-panel folding solar arrays (detailed with procedural gold-foil, radiator fins, and micro-truss geometry).
2. Zero-G Choreography:
   - (0-5s) A free-flying habitation module approaches the central core, firing brief cold-gas RCS thruster particle puffs to brake and align its docking collar with sub-millimeter precision.
   - (5-11s) An articulated 3-joint robotic manipulator arm guides the centrifugal ring segments into position as docking clamps lock together.
   - (11-15s) Four accordion-folded solar wings extend outward smoothly (alternating hinge angles $+\theta, -\theta, +\theta...$) and rotate to face the sun.
   - (15-18s) The assembled ring spins up smoothly to simulate artificial gravity while Earth's curved atmospheric limb glows below.
3. Lighting & Rendering: Use harsh, high-contrast directional sunlight with deep space shadows, subtle Earthshine fill light, and crisp specular highlights on metallic hulls. Render deterministically (`t = frame / 30`), verify keyframes, and encode to `orbital_station.mp4`.
