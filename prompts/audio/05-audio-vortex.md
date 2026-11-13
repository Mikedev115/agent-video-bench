---
id: "05"
slug: audio-vortex
track: audio
source: Gemini
title_th: ซิมโฟนีอนุภาค 3 มิติซิงก์จังหวะเสียงสังเคราะห์
title_en: Audio-reactive particle symphony
measures_th: วัดการคุม Pipeline เสียง + ภาพครบวงจร
measures_en: A full audio + video pipeline in one run
tags: WAV synthesis, FFT, GPU particles, FFmpeg mux
output: audio_vortex.mp4
duration: 15
fps: 30
resolution: 1920x1080
check_th:
  - ภาพกับเสียงดีเลย์ไม่ตรงจังหวะ Kick
  - ไฟล์ MP4 ไม่มีเสียงติดมาด้วย
  - เสียงแตก (Clipping) จากการคำนวณ Waveform เกิน [-1.0, 1.0]
check_en:
  - Does the picture lag behind the kick drum?
  - Is the MP4 missing its audio track?
  - Does the sound clip because the waveform goes past [-1.0, 1.0]?
---

Create an end-to-end audio-reactive 3D visualizer video `audio_vortex.mp4` (1920x1080, 30 FPS, 15 seconds) with synthesized stereo audio muxed cleanly into the final MP4. Everything must be generated programmatically with zero external audio or 3D files.

Pipeline & Technical Requirements:

1. Procedural Audio Synthesis: Write a script (Node.js or Python) to synthesize a 15-second 128 BPM electronic track (`track.wav`, 44.1kHz stereo) featuring a punchy sub-bass kick on every beat, a filtered sawtooth arpeggio, and a snare/hi-hat pattern.
2. Spectral & Beat Extraction: Analyze `track.wav` programmatically to extract exact per-frame (`450 frames`) amplitude envelopes for Low (20-150Hz), Mid (150-2000Hz), and High (2000Hz+) frequency bands, saving them as a JSON envelope map.
3. 3D Audio-Reactive Scene: In Three.js, build a central icosahedral frequency core surrounded by 15,000 GPU-driven particles arranged in concentric vortex rings. Drive core displacement, ring rotation velocity, particle shockwaves, and camera FOV pulses directly from the JSON envelope data.
4. Muxing & Verification: Render all 450 frames deterministically, mux the video stream with `track.wav` using FFmpeg (`-c:v libx264 -c:a aac -b:a 192k -shortest`), and verify that the final MP4 contains both valid video and audio streams with exact duration alignment.
