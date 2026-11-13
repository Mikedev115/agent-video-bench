/* agent-video-bench — renders the prompt catalogue from prompts/index.json.
   Prompt bodies stay in prompts/<track>/*.md so the repo reads well on GitHub too. */
(() => {
  'use strict';

  const TRACKS = ['all', 'mechanics', 'rigid-body', 'soft-and-fluid', 'shader', 'world', 'architecture', 'rig', 'audio'];

  const I18N = {
    th: {
      title: 'Agent Video Bench — พรอมป์ที่บังคับให้เอเจนต์เรนเดอร์วิดีโอจริง',
      eyebrow: '30 พรอมป์ · เรนเดอร์จริง · ตรวจได้ทีละเฟรม',
      h1: 'พรอมป์ที่บังคับให้เอเจนต์<br>เรนเดอร์วิดีโอจริง',
      lede: 'สามสิบโจทย์ แยกตามสายทักษะ แต่ละตัวบังคับผลลัพธ์เป็นไฟล์ MP4 ที่เปิดตรวจทีละเฟรมได้ พร้อม “จุดจับผิด” และ gate ที่ต้องผ่าน (determinism, temporal, ffprobe) ก่อนส่งงาน',
      stats: ['<b>30</b> พรอมป์', '<b>08</b> สายทักษะ', '<b>30</b> FPS ล็อกตายตัว', '<b>0</b> แอสเซ็ตภายนอก'],
      howH: 'วิธีใช้',
      steps: [
        '<b>เลือกโจทย์</b> การ์ดแต่ละใบบอกไฟล์ผลลัพธ์ ความยาว และสิ่งที่ถูกวัด',
        '<b>คัดลอกทั้งพรอมป์</b> วางให้เอเจนต์ที่รันโค้ดได้ (มี Node, Chromium, FFmpeg)',
        '<b>ตรวจตามจุดจับผิด</b> เปิด MP4 กับเฟรมที่มันอ้างว่าเทสต์ ไม่ผ่านให้ตีกลับพร้อมระบุข้อ'
      ],
      benchH: 'พรอมป์ทั้งชุด',
      copyAll: 'คัดลอกทั้งชุด',
      copy: 'คัดลอก',
      copied: 'คัดลอกแล้ว',
      expand: 'ขยาย',
      collapse: 'ย่อ',
      output: 'ไฟล์',
      length: 'ความยาว',
      format: 'รูปแบบ',
      checks: 'จุดจับผิด',
      filters: 'กรองตามสายทักษะ',
      all: 'ทั้งหมด',
      tracks: {
        mechanics: 'กลไก',
        'rigid-body': 'ฟิสิกส์แข็ง',
        'soft-and-fluid': 'ผ้า & ของไหล',
        shader: 'เชเดอร์',
        world: 'ฉากใหญ่',
        architecture: 'สถาปัตยกรรม',
        rig: 'ริก',
        audio: 'เสียง'
      },
      loadError: 'อ่าน prompts/index.json ไม่ได้ — ถ้าเปิดไฟล์นี้ด้วยการดับเบิลคลิก ให้รัน `node scripts/serve.mjs` แล้วเปิด http://localhost:4173 หรือดูผ่าน GitHub Pages',
      toastCopied: 'คัดลอกพรอมป์แล้ว',
      toastCopiedAll: 'คัดลอกทั้งชุดแล้ว',
      toastFail: 'คัดลอกไม่ได้ — เลือกข้อความในกล่องแล้วกด Ctrl+C'
    },
    en: {
      title: 'Agent Video Bench — prompts that force an agent to render real video',
      eyebrow: '30 prompts · real renders · checkable frame by frame',
      h1: 'Prompts that force an agent<br>to render actual video',
      lede: 'Thirty jobs grouped by the skill each one measures. Every prompt demands an MP4 you can inspect frame by frame, ships a “what to catch” list, and names the gates a run must pass - determinism, temporal variance, ffprobe - before it counts as done.',
      stats: ['<b>30</b> prompts', '<b>08</b> skill tracks', '<b>30</b> FPS locked', '<b>0</b> external assets'],
      howH: 'How to use',
      steps: [
        '<b>Pick a job</b> — each card names the output file, its length and what it measures',
        '<b>Copy the whole prompt</b> — paste it into an agent that can run code (Node, Chromium, FFmpeg)',
        '<b>Check it against the list</b> — open the MP4 and the frames it says it verified; if they fail, send it back by number'
      ],
      benchH: 'The full set',
      copyAll: 'Copy all',
      copy: 'Copy',
      copied: 'Copied',
      expand: 'Expand',
      collapse: 'Collapse',
      output: 'Output',
      length: 'Length',
      format: 'Format',
      checks: 'What to catch',
      filters: 'Filter by skill track',
      all: 'All',
      tracks: {
        mechanics: 'Mechanics',
        'rigid-body': 'Rigid body',
        'soft-and-fluid': 'Soft & fluid',
        shader: 'Shader',
        world: 'World',
        architecture: 'Architecture',
        rig: 'Rig',
        audio: 'Audio'
      },
      loadError: 'Could not read prompts/index.json — run `node scripts/serve.mjs` and open http://localhost:4173, or use the GitHub Pages URL.',
      toastCopied: 'Prompt copied',
      toastCopiedAll: 'Whole set copied',
      toastFail: 'Copy blocked — select the text and press Ctrl+C'
    }
  };

  const state = { lang: 'th', track: 'all', items: [], open: new Set(), texts: new Map() };

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (key) => I18N[state.lang][key];

  let toastTimer = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  /* The .md files carry their metadata in front matter; the reader only ever
     sees, and copies, the prompt text below it. */
  function stripFrontMatter(raw) {
    if (!raw.startsWith('---')) return raw;
    const end = raw.indexOf('\n---', 3);
    if (end < 0) return raw;
    return raw.slice(end + 4).trim();
  }

  async function textFor(item) {
    if (state.texts.has(item.id)) return state.texts.get(item.id);
    const res = await fetch('prompts/' + item.file);
    if (!res.ok) throw new Error('prompt ' + item.id + ': ' + res.status);
    const text = stripFrontMatter((await res.text()).trim());
    state.texts.set(item.id, text);
    return text;
  }

  function chrome() {
    document.documentElement.lang = state.lang;
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key === 'h1') el.innerHTML = t('h1');
      else el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-list]').forEach((el) => {
      const list = t(el.dataset.i18nList);
      el.innerHTML = list.map((x, i) => `<li>${el.tagName === 'OL' ? '<span class="n">' + (i + 1) + '</span>' : ''}<p>${x}</p></li>`).join('');
    });
    document.querySelectorAll('.lang button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang));
    });
  }

  function renderFilters() {
    const box = $('#filters');
    box.setAttribute('aria-label', t('filters'));
    box.innerHTML = TRACKS.map((key) => {
      const n = key === 'all' ? state.items.length : state.items.filter((i) => i.track === key).length;
      const label = key === 'all' ? t('all') : t('tracks')[key];
      return `<button type="button" class="chip" data-track="${key}" aria-pressed="${key === state.track}">${esc(label)} <span aria-hidden="true">${n}</span></button>`;
    }).join('');
    box.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.track = chip.dataset.track;
        renderFilters();
        renderCards();
      });
    });
  }

  function cardHTML(item) {
    const specs = [
      [t('output'), item.output],
      [t('length'), item.duration + 's'],
      [t('format'), item.resolution.replace('x', '×') + ' · ' + item.fps + ' fps']
    ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const tags = item.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join('');
    const checks = item.checks[state.lang].map((x) => `<li>${esc(x)}</li>`).join('');
    return `
      <div class="rail">
        <a class="num" href="#p-${item.id}" aria-label="prompt ${item.id}">${item.id}</a>
        <dl class="specs">${specs}</dl>
        <span class="src">${esc(item.source)}</span>
      </div>
      <div class="card-body">
        <h2>${esc(item.title[state.lang])}</h2>
        <p class="measures">${esc(item.measures[state.lang])}</p>
        <div class="tags">${tags}</div>
        <div class="prompt is-clamped" data-id="${item.id}">
          <div class="prompt-bar">
            <span>prompt · ${item.id}</span>
            <div class="prompt-acts">
              <button type="button" class="btn" data-act="copy">${esc(t('copy'))}</button>
              <button type="button" class="btn" data-act="toggle" aria-expanded="false">${esc(t('expand'))}</button>
            </div>
          </div>
          <pre><code></code></pre>
        </div>
        <div class="checks">
          <h3>${esc(t('checks'))}</h3>
          <ul>${checks}</ul>
        </div>
      </div>`;
  }

  function fillCard(card) {
    const id = card.dataset.id;
    const item = state.items.find((i) => i.id === id);
    const prompt = $('.prompt', card);
    const code = $('pre code', card);
    if (!item) return;
    textFor(item).then((text) => {
      code.textContent = text;
      if ($('pre', prompt).scrollHeight <= 260) {
        prompt.classList.remove('is-clamped');
        prompt.classList.add('is-open');
        $('[data-act="toggle"]', prompt).hidden = true;
      }
      if (state.open.has(id)) {
        prompt.classList.add('is-open');
        prompt.classList.remove('is-clamped');
      }
    }).catch(() => {
      code.textContent = 'prompts/' + item.file;
    });
  }

  let observer = null;
  function observeReveal(box) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
    }
    box.querySelectorAll('.card').forEach((card) => {
      if (card.classList.contains('in')) return;
      card.classList.add('reveal');
      observer.observe(card);
    });
  }

  function focusHash() {
    const id = location.hash.replace('#p-', '');
    if (!id) return;
    const card = document.getElementById('p-' + id);
    if (!card) return;
    card.classList.add('in');
    const prompt = $('.prompt', card);
    prompt.classList.add('is-open');
    prompt.classList.remove('is-clamped');
    state.open.add(id);
    const btn = $('[data-act="toggle"]', card);
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = t('collapse');
  }

  function renderCards() {
    const shown = state.items.filter((i) => state.track === 'all' || i.track === state.track);
    const box = $('#cards');
    box.innerHTML = shown.map((item) => (
      `<article class="card" id="p-${item.id}" data-id="${item.id}" data-track="${item.track}">${cardHTML(item)}</article>`
    )).join('');
    $('#count').textContent = `${shown.length} / ${state.items.length}`;
    box.querySelectorAll('.card').forEach((card) => {
      fillCard(card);
      const prompt = $('.prompt', card);
      const item = state.items.find((i) => i.id === card.dataset.id);

      $('[data-act="copy"]', card).addEventListener('click', async (event) => {
        const btn = event.currentTarget;
        const text = await textFor(item).catch(() => '');
        if (!text) return;
        const ok = await copyText(text);
        btn.dataset.state = ok ? 'ok' : '';
        btn.textContent = ok ? t('copied') : t('copy');
        toast(ok ? t('toastCopied') : t('toastFail'));
        setTimeout(() => {
          btn.dataset.state = '';
          btn.textContent = t('copy');
        }, 1800);
      });

      $('[data-act="toggle"]', card).addEventListener('click', (event) => {
        const btn = event.currentTarget;
        const open = !prompt.classList.contains('is-open');
        prompt.classList.toggle('is-open', open);
        prompt.classList.toggle('is-clamped', !open);
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? t('collapse') : t('expand');
        if (open) state.open.add(item.id);
        else state.open.delete(item.id);
      });
    });
    observeReveal(box);
    focusHash();
  }

  async function load() {
    try {
      const res = await fetch('prompts/index.json');
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      state.items = data.items;
    } catch {
      const err = $('#load-error');
      err.hidden = false;
      err.textContent = t('loadError');
      return;
    }
    chrome();
    renderFilters();
    renderCards();
    state.items.forEach((item) => textFor(item).catch(() => {}));
  }

  document.querySelectorAll('.lang button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.lang === btn.dataset.lang) return;
      state.lang = btn.dataset.lang;
      try { localStorage.setItem('avb-lang', state.lang); } catch { /* storage blocked */ }
      chrome();
      renderFilters();
      renderCards();
    });
  });

  $('#copy-all').addEventListener('click', async () => {
    const parts = [];
    for (const item of state.items) {
      const text = await textFor(item).catch(() => '');
      if (text) parts.push(`# ${item.id} — ${item.title.en}\n\n${text}`);
    }
    if (!parts.length) return;
    const ok = await copyText(parts.join('\n\n---\n\n'));
    toast(ok ? t('toastCopiedAll') : t('toastFail'));
  });

  window.addEventListener('hashchange', focusHash);

  try {
    const saved = localStorage.getItem('avb-lang');
    if (saved === 'th' || saved === 'en') state.lang = saved;
  } catch { /* storage blocked */ }

  load();
})();
