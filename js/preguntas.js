'use strict';

function goTo(page) { window.location.href = page; }

const STORAGE_KEY = 'pq_states';
const HINTS_KEY   = 'pq_hints';

let activePool;
let activePoolSuffix = 'main';

function storKey() { return activePoolSuffix === 'main' ? STORAGE_KEY : STORAGE_KEY + '_extra'; }
function hintKey() { return activePoolSuffix === 'main' ? HINTS_KEY  : HINTS_KEY  + '_extra'; }
const DIFFS       = ['facil', 'media', 'dificil'];
const CAT_EMOJIS  = {
  'Cultura general': '🧠',
  'Actualidad':      '📰',
  'Geografía':       '🌍',
  'Bandas sonoras':  '🎵',
  'Disney':          '🏰',
  'Adivinanzas':     '🤔',
};
const DIFF_LABELS       = { facil: '🟢 Fácil', media: '🟡 Media', dificil: '🔴 Difícil' };
const CATS_WITH_OPTIONS = new Set(['Cultura general', 'Actualidad', 'Geografía']);

let states        = {};
let hints         = {};
let currentFilter = 'all';

// ── LocalStorage ──────────────────────────────────────────
function loadStates() {
  try { states = JSON.parse(localStorage.getItem(storKey())) || {}; }
  catch (e) { states = {}; }
}

function saveStates() {
  localStorage.setItem(storKey(), JSON.stringify(states));
}

function loadHints() {
  try { hints = JSON.parse(localStorage.getItem(hintKey())) || {}; }
  catch (e) { hints = {}; }
}

function saveHints() {
  localStorage.setItem(hintKey(), JSON.stringify(hints));
}

function getHint(id, defaultHint) {
  return hints[id] !== undefined ? hints[id] : (defaultHint || '');
}

function makeHintSpan(id, defaultHint) {
  const span = document.createElement('span');
  span.className = 'q-hint';
  const text = getHint(id, defaultHint);
  if (text) {
    span.textContent = `💡 ${text}`;
  } else {
    span.classList.add('q-hint-empty');
    span.textContent = '💡 (sin pista)';
  }
  span.addEventListener('click', () => editHint(id, defaultHint, span));
  return span;
}

function editHint(id, defaultHint, el) {
  const current = getHint(id, defaultHint);
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'q-hint-input';
  input.value = current;
  el.replaceWith(input);
  input.focus();
  input.select();

  let committed = false;

  function commit() {
    if (committed) return;
    committed = true;
    const val = input.value.trim();
    if (val !== defaultHint) {
      if (val) hints[id] = val;
      else delete hints[id];
      saveHints();
    }
    input.replaceWith(makeHintSpan(id, defaultHint));
  }

  function revert() {
    if (committed) return;
    committed = true;
    input.replaceWith(makeHintSpan(id, defaultHint));
  }

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); input.removeEventListener('blur', commit); commit(); }
    if (e.key === 'Escape') { e.preventDefault(); input.removeEventListener('blur', commit); revert(); }
  });
}

// ── ID helpers ────────────────────────────────────────────
function qId(catKey, diff, idx) {
  return `pq_${catKey.replace(/\s+/g, '_')}_${diff}_${idx}`;
}

function getState(id) { return states[id] || 'none'; }

// ── State toggle ──────────────────────────────────────────
function toggleState(id, newState) {
  states[id] = getState(id) === newState ? 'none' : newState;
  saveStates();
  refreshItem(id);
  updateStats();
  applyFilter();
}

function refreshItem(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (!el) return;
  const s = getState(id);
  el.dataset.state = s;
  el.querySelector('.q-ok') .classList.toggle('active', s === 'ok');
  el.querySelector('.q-bad').classList.toggle('active', s === 'bad');
}

// ── Stats ─────────────────────────────────────────────────
function getAllIds() {
  const ids = [];
  for (const [catKey, catVal] of Object.entries(activePool))
    for (const diff of DIFFS)
      (catVal[diff] || []).forEach((_, i) => ids.push(qId(catKey, diff, i)));
  return ids;
}

function updateStats() {
  const ids     = getAllIds();
  const total   = ids.length;
  const ok      = ids.filter(id => getState(id) === 'ok').length;
  const bad     = ids.filter(id => getState(id) === 'bad').length;
  const pending = total - ok - bad;

  const el = document.getElementById('pqStats');
  if (el) el.innerHTML = `
    <span class="stat-chip total">${total} total</span>
    <span class="stat-chip ok-chip">✓ ${ok}</span>
    <span class="stat-chip bad-chip">✗ ${bad}</span>
    <span class="stat-chip pend-chip">⏳ ${pending}</span>
  `;
}

// ── Filter ────────────────────────────────────────────────
function applyFilter() {
  document.querySelectorAll('.q-item').forEach(el => {
    const s    = el.dataset.state || 'none';
    const show = currentFilter === 'all' || s === currentFilter;
    el.classList.toggle('q-hidden', !show);
  });

  document.querySelectorAll('.diff-section').forEach(sec => {
    const visible = [...sec.querySelectorAll('.q-item')].some(el => !el.classList.contains('q-hidden'));
    sec.classList.toggle('q-hidden', !visible);
  });

  document.querySelectorAll('.cat-section').forEach(sec => {
    const visible = [...sec.querySelectorAll('.q-item')].some(el => !el.classList.contains('q-hidden'));
    sec.classList.toggle('q-hidden', !visible);
  });

  const container = document.getElementById('questionsContainer');
  let emptyEl = document.getElementById('pqEmpty');
  const allHidden = [...document.querySelectorAll('.q-item')].every(el => el.classList.contains('q-hidden'));
  if (allHidden) {
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.id = 'pqEmpty';
      emptyEl.className = 'pq-empty';
      emptyEl.textContent = 'No hay preguntas con este filtro.';
      container.after(emptyEl);
    }
    emptyEl.style.display = 'block';
  } else if (emptyEl) {
    emptyEl.style.display = 'none';
  }
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.filter === filter)
  );
  applyFilter();
}

// ── Reset all ─────────────────────────────────────────────
function resetAll() {
  if (!confirm('¿Limpiar todas las marcas?')) return;
  states = {};
  saveStates();
  document.querySelectorAll('.q-item').forEach(el => {
    el.dataset.state = 'none';
    el.querySelector('.q-ok') .classList.remove('active');
    el.querySelector('.q-bad').classList.remove('active');
  });
  updateStats();
  applyFilter();
}

// ── Render ────────────────────────────────────────────────
function buildPage() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;

  for (const [catKey, catVal] of Object.entries(activePool)) {
    const catSection = document.createElement('div');
    catSection.className = 'cat-section';

    const catTitle = document.createElement('h2');
    catTitle.className = 'cat-title';
    catTitle.textContent = `${CAT_EMOJIS[catKey] || '❓'} ${catKey}`;
    catSection.appendChild(catTitle);

    for (const diff of DIFFS) {
      const arr = catVal[diff] || [];
      if (!arr.length) continue;

      const diffSection = document.createElement('div');
      diffSection.className = 'diff-section';

      const diffTitle = document.createElement('h3');
      diffTitle.className = 'diff-title';
      diffTitle.textContent = DIFF_LABELS[diff];
      diffSection.appendChild(diffTitle);

      arr.forEach((q, i) => {
        const id    = qId(catKey, diff, i);
        const state = getState(id);

        const isAudio  = !!q.audio;
        const mainText = isAudio ? q.trackName.split('\n\n')[0] : q.pregunta;

        const item = document.createElement('div');
        item.className  = 'q-item';
        item.dataset.id = id;
        item.dataset.state = state;

        // Row 1 col 1: ✓ button
        const okBtn = document.createElement('button');
        okBtn.className = `q-btn q-ok${state === 'ok' ? ' active' : ''}`;
        okBtn.title = 'Marcar como vista';
        okBtn.textContent = '✓';
        okBtn.addEventListener('click', () => toggleState(id, 'ok'));

        // Row 1 col 2: question text
        const textSpan = document.createElement('span');
        textSpan.className = 'q-text';
        if (isAudio) {
          const badge = document.createElement('span');
          badge.className = 'q-audio-badge';
          badge.textContent = '🎵 Audio';
          textSpan.appendChild(badge);
          textSpan.append(` ${mainText}`);
        } else {
          textSpan.textContent = mainText;
        }

        // Row 2 col 1: ✗ button
        const badBtn = document.createElement('button');
        badBtn.className = `q-btn q-bad${state === 'bad' ? ' active' : ''}`;
        badBtn.title = 'Marcar para revisar';
        badBtn.textContent = '✗';
        badBtn.addEventListener('click', () => toggleState(id, 'bad'));

        // Row 2 col 2: editable hint
        const hintSpan = makeHintSpan(id, q.pista || '');

        item.appendChild(okBtn);
        item.appendChild(textSpan);
        item.appendChild(badBtn);
        item.appendChild(hintSpan);

        if (CATS_WITH_OPTIONS.has(catKey) && q.opciones?.length) {
          const optDiv = document.createElement('div');
          optDiv.className = 'q-options';
          q.opciones.forEach((opt, idx) => {
            const chip = document.createElement('span');
            chip.className = `q-opt${idx === q.correcta ? ' q-opt-correct' : ''}`;
            chip.textContent = opt;
            optDiv.appendChild(chip);
          });
          item.appendChild(optDiv);
        }

        diffSection.appendChild(item);
      });

      catSection.appendChild(diffSection);
    }

    container.appendChild(catSection);
  }
}

// ── Pool switch ───────────────────────────────────────────
function switchPool(suffix) {
  activePoolSuffix = suffix;
  activePool = suffix === 'main' ? questionPools : questionPoolsExtra;

  document.querySelectorAll('.pool-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.pool === suffix)
  );

  loadStates();
  loadHints();

  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  const emptyEl = document.getElementById('pqEmpty');
  if (emptyEl) emptyEl.style.display = 'none';

  currentFilter = 'all';
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.filter === 'all')
  );

  buildPage();
  updateStats();
  applyFilter();
}

// ── Init ──────────────────────────────────────────────────
activePool = questionPools;
loadStates();
loadHints();
buildPage();
updateStats();
applyFilter();

document.querySelectorAll('.filter-btn[data-filter]').forEach(btn =>
  btn.addEventListener('click', () => setFilter(btn.dataset.filter))
);
