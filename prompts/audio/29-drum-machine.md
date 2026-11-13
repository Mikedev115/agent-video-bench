---
id: "29"
slug: drum-machine
track: audio
source: Aetox
title_th: เครื่องกลองที่ตีตรงจังหวะเสียงของตัวเอง
title_en: Drum machine struck by its own audio
measures_th: วัดการซิงก์เสียงกับภาพระดับเฟรม ผ่าน event list ชุดเดียวที่ทั้งเสียงและหุ่นยนต์ใช้ร่วมกัน
measures_en: Frame-accurate audio/visual sync through one shared event list
tags: WAV synthesis, Onset alignment, FFmpeg mux, Clipping check
output: drum_machine.mp4
duration: 16
fps: 30
resolution: 1920x1080
check_th:
  - ค้อนหรือนิ้วตีไม่ตรงจังหวะเสียง (คลาดเกิน 1 เฟรม หรือ 33 ms)
  - ไฟล์ MP4 ไม่มีแทร็กเสียง หรือความยาวเสียงกับภาพไม่ตรงกัน
  - เสียงแตกเพราะ waveform เกิน [-1.0, 1.0] หรือ peak ทะลุ 0 dBFS
check_en:
  - Do the sticks strike off the beat (off by more than one frame, 33 ms)?
  - Is the MP4 missing an audio track, or are audio and video durations mismatched?
  - Does the sound clip because the waveform exceeds [-1.0, 1.0]?
---

Create a deterministic 16-second audio-visual film rendered to `drum_machine.mp4` (1920x1080, 30 FPS, H.264 yuv420p + AAC 192 kbps stereo) using Three.js in headless Chromium, a synthesised score, and FFmpeg. Zero external audio, samples, models or textures.

Pipeline, in this order:
1. Write a script that synthesises `track.wav` (44.1 kHz stereo) from a 120 BPM, 8-bar pattern: kick (sine sweep 90 to 45 Hz with a click transient), snare (filtered noise plus body tone), closed and open hats (short metallic noise bursts). Render every hit from one event list of `{time, instrument, velocity}` and normalise so the peak sits at -1 dBFS - never let a sample go past [-1.0, 1.0].
2. Save that same event list as `events.json`. The 3D machine and the audio must both read it; the visuals may not use their own timing source.
3. Build the machine: a brushed-aluminium drum module with kick pad, snare pad, and a hat stand, each with an articulated arm or beater that strikes on its event and recoils within 120 ms. LEDs flash on the same frame. A mechanical transport wheel turns at exactly one revolution per bar.
4. Camera: slow orbit from a three-quarter close-up to a top-down reveal of the whole module, easing across the 16 s.

Sync rules: a strike must land on the frame nearest its event time - `frame = round(event.time * 30)` - and no strike may lead or lag by more than one frame. Log every visual strike frame and its event time to `sync.csv`.

Audio finish: encode with FFmpeg `-c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest`, with the WAV starting at exactly t = 0 and the video stream 16.00 s.

Visual style: precision instrument - dark studio, brushed metal, one warm key light, shallow depth of field on the strike points, no on-screen text.

Deliverables & gates:
1. `frames/` (480 PNGs), `track.wav`, `events.json`, `sync.csv`, `drum_machine.mp4`, `contact-sheet.png`.
2. Sync gate: every strike frame equals `round(event.time * 30)`; fail on any mismatch.
3. Audio gates: peak at or below -1 dBFS, no sample beyond +/-1.0 (scan the float buffer and log min/max), and an onset detected in the WAV within 5 ms of each event time.
4. Mux gate: ffprobe reports one video stream 1920x1080 30/1 yuv420p and one AAC stereo 44.1 kHz stream, both 16.00 +/- 0.10 s.
5. Determinism gate: two renders from the same seed, identical sha256 for frame 240.

Re-render until every gate passes; drift on the kick is the first thing a viewer hears.
