---
id: "13"
slug: parachute-drop
track: soft-and-fluid
source: Gemini
title_th: ร่มชูชีพกางต้านลมและระบบเชือกดึงน้ำหนัก
title_en: Parachute deployment with two-way coupling
measures_th: วัดการเชื่อมโยงแรงสองทาง (Two-Way Coupling) ระหว่างผ้าร่มที่รับแรงต้านอากาศกับกล่องสัมภาระผ่านเส้นเชือกตึง
measures_en: Two-way coupling between aerodynamic cloth and a heavy crate through taut lines
tags: Aero drag, Distance constraints, Chase camera, Two-way coupling
output: parachute_drop.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - เชือกยืดยาวเหมือนหนังยางหรือขาดออกจากตัวร่ม
  - ผ้าร่มไม่พองตัวรับลมแต่ลู่เป็นแท่ง
  - ตัวกล่องไม่ชะลอความเร็วตอนร่มกางออก
check_en:
  - Do the cords stretch like rubber or detach from the canopy?
  - Does the canopy refuse to inflate and collapse into a streamer?
  - Does the crate fail to decelerate when the canopy opens?
---

Build a 16-second 3D aerodynamic parachute deployment animation rendered to `parachute_drop.mp4` (1920x1080, 30 FPS) using Three.js, headless Chromium, and FFmpeg. Zero external assets allowed.

Aerodynamics & Coupled Physics:

1. Two-Way Coupled System: Construct a circular dome parachute canopy (high-density Verlet cloth mesh), 16 inextensible suspension cords (distance constraints), and a heavy rigid-body supply crate suspended below.
2. Deployment Sequence:
   - (0-4s) The crate and packed cloth bundle free-fall rapidly through a cloudy sky with vertical wind streaks.
   - (4-9s) The canopy unfurls and inflates dramatically as per-triangle aerodynamic drag forces ($\mathbf{F}_d = -\frac{1}{2}\rho C_d A (\mathbf{v} \cdot \mathbf{n})^2 \mathbf{n}$) catch the upward airflow, violently decelerating the falling crate with realistic pendulum sway.
   - (9-16s) The parachute glides steadily under gentle crosswind gusts toward a sunlit canyon plateau below.
3. Camera & Verification: Track the descent with a dynamic chase camera that pulls back during canopy inflation to capture the full shockwave of deceleration. Render deterministically (`t = frame / 30`), inspect keyframe PNGs to confirm taut suspension lines and symmetric canopy inflation without self-intersection, and compile `parachute_drop.mp4`.
