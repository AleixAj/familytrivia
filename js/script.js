// ============================================================
// Family Trivia - Main Game Controller
// Handles navigation, board rendering, question modals, scoring,
// game-state persistence, audio playback and final statistics.
// Question content lives in js/questions.js.
// ============================================================

// ==================== UI UTILS ====================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

function showToast(message, type = 'warning') {
  let container = document.getElementById('ajToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ajToastContainer';
    container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `<div class="d-flex"><div class="toast-body fw-semibold">${escapeHtml(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  container.appendChild(el);

  // Bootstrap JS may be unavailable (blocked CDN); fall back to a plain timed toast.
  if (window.bootstrap?.Toast) {
    const toast = new bootstrap.Toast(el, { delay: 3500 });
    toast.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  } else {
    el.classList.add('show');
    setTimeout(() => el.remove(), 3500);
  }
}

// ==================== NAVIGATION ====================
function goTo(page) {
  if (typeof saveGameState === 'function') saveGameState();
  window.location.href = page;
}

function goToGamePanel() {
  if (typeof saveGameState === 'function') saveGameState();
  sessionStorage.setItem(GAME_MODE_KEY, 'teams');

  // One card per pair formed in the wheels; fall back to the classic five teams.
  let pairs = [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem('ruletaTeams') || '[]');
    if (Array.isArray(parsed)) pairs = parsed.filter(Boolean);
  } catch {}

  let count = DEFAULT_TEAMS;
  if (pairs.length > MAX_PLAYERS) {
    count = MAX_PLAYERS;
    showToast(`Solo caben ${MAX_PLAYERS} equipos, se usarán los ${MAX_PLAYERS} primeros`);
  } else if (pairs.length) {
    count = pairs.length;
  } else {
    showToast('No has formado ninguna pareja: se usarán los 5 equipos por defecto', 'info');
  }

  // A different number of teams means the previous board no longer fits: start clean.
  const savedCount = Number(JSON.parse(sessionStorage.getItem(GAME_STATE_KEY) || '{}').teamCount) || null;
  if (savedCount && savedCount !== count) clearGameProgress();

  sessionStorage.setItem(TEAM_COUNT_KEY, String(count));
  sessionStorage.setItem('familyTriviaStartGame', '1');
  window.location.href = 'index.html?start=1';
}

function goToTeamsSetup() {
  const fromOtherMode = getGameMode() !== 'teams';
  sessionStorage.setItem(GAME_MODE_KEY, 'teams');
  sessionStorage.setItem(TEAM_COUNT_KEY, String(DEFAULT_TEAMS));

  if (fromOtherMode) {
    // Switching from solo/players starts a new game, so don't carry that progress over.
    clearGameProgress();
    sessionStorage.removeItem(CUSTOM_NAMES_KEY);
    window.location.href = 'ruletas.html';
    return;
  }
  goTo('ruletas.html');
}

function goToPortfolio() {
  if (typeof saveGameState === 'function') saveGameState();
  window.location.href = 'https://aleixaj.com/';
}

function openRulesModal() {
  const modalEl = document.getElementById('rulesModal');
  if (!modalEl) return;

  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
    return;
  }

  modalEl.classList.add('show');
  modalEl.style.display = 'block';
  modalEl.removeAttribute('aria-hidden');
}

function closeRulesModal() {
  const modalEl = document.getElementById('rulesModal');
  if (!modalEl) return;

  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    return;
  }

  modalEl.classList.remove('show');
  modalEl.style.display = 'none';
  modalEl.setAttribute('aria-hidden', 'true');
}

// ==================== GAME MODE ====================
// 'solo'    -> 1 tarjeta
// 'players' -> N tarjetas, una por persona
// 'teams'   -> 5 equipos formados en ruletas.html
const GAME_MODE_KEY = 'familyTriviaMode';
const TEAM_COUNT_KEY = 'familyTriviaTeamCount';
const CUSTOM_NAMES_KEY = 'familyTriviaNames';
const DEFAULT_TEAMS = 5;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 12;

function getGameMode() {
  const mode = sessionStorage.getItem(GAME_MODE_KEY);
  return mode === 'solo' || mode === 'players' ? mode : 'teams';
}

function getStoredTeamCount() {
  const stored = parseInt(sessionStorage.getItem(TEAM_COUNT_KEY), 10);
  return Number.isFinite(stored) ? stored : null;
}

// Names typed in solo/players setup; ruletas names live in their own storage.
function getCustomNames() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CUSTOM_NAMES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeCustomNames(names) {
  sessionStorage.setItem(CUSTOM_NAMES_KEY, JSON.stringify(names));
}

function applyGameMode(mode = getGameMode()) {
  const solo = mode === 'solo';
  document.body.classList.toggle('solo-mode', solo);

  const count = solo ? 1 : (getStoredTeamCount() || DEFAULT_TEAMS);

  setTeamCount(count);
  document.getElementById('teamsRuletaBtn')?.classList.toggle('d-none', mode !== 'teams');
}

// ==================== SETUP MODALS ====================
function openSetupModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(el).show();
    return;
  }
  el.classList.add('show');
  el.style.display = 'block';
  el.removeAttribute('aria-hidden');
}

function closeSetupModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(el).hide();
    return;
  }
  el.classList.remove('show');
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
}

// ---- Un jugador ----
function chooseSoloMode() {
  document.getElementById('modeButtons')?.classList.add('d-none');
  const panel = document.getElementById('soloNamePanel');
  panel?.classList.remove('d-none');
  const input = document.getElementById('soloNameInput');
  if (input) {
    input.value = '';
    input.focus();
  }
}

function backToModeSelect() {
  document.getElementById('soloNamePanel')?.classList.add('d-none');
  document.getElementById('modeButtons')?.classList.remove('d-none');
}

function startSoloGame() {
  const input = document.getElementById('soloNameInput');
  const name = (input?.value || '').trim();
  if (!name) {
    showToast('Escribe tu nombre para empezar');
    input?.focus();
    return;
  }
  startCustomGame('solo', [name]);
}

// ---- Multijugador individual ----
function choosePlayersMode() {
  const input = document.getElementById('playersCountInput');
  if (input) input.value = String(getStoredTeamCount() || 4);
  openSetupModal('playersCountModal');
  setTimeout(() => input?.focus(), 350);
}

function confirmPlayersCount() {
  const input = document.getElementById('playersCountInput');
  const count = parseInt(input?.value, 10);
  if (!Number.isFinite(count) || count < MIN_PLAYERS || count > MAX_PLAYERS) {
    showToast(`Escribe un número entre ${MIN_PLAYERS} y ${MAX_PLAYERS}`);
    input?.focus();
    return;
  }

  buildPlayerNameInputs(count);
  closeSetupModal('playersCountModal');
  setTimeout(() => {
    openSetupModal('playerNamesModal');
    setTimeout(() => document.querySelector('#playerNamesList input')?.focus(), 350);
  }, 260);
}

function buildPlayerNameInputs(count) {
  const list = document.getElementById('playerNamesList');
  if (!list) return;
  list.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = 'player-name-row';
    row.innerHTML = `
      <span class="player-name-dot" style="background:${teamColorAt(i)}"></span>
      <input type="text" class="solo-name-input player-name-input" data-player="${i}"
             maxlength="20" autocomplete="off" placeholder="Jugador ${i + 1}" />`;
    list.appendChild(row);
  }
  list.dataset.count = String(count);
}

function readPlayerNameInputs() {
  const list = document.getElementById('playerNamesList');
  const count = parseInt(list?.dataset.count || '0', 10);
  const names = [];
  for (let i = 0; i < count; i++) {
    const input = list.querySelector(`input[data-player="${i}"]`);
    names.push((input?.value || '').trim() || `Jugador ${i + 1}`);
  }
  return names;
}

function skipPlayerNames() {
  const count = parseInt(document.getElementById('playerNamesList')?.dataset.count || '0', 10);
  startPlayersGame(Array.from({ length: count }, (_, i) => `Jugador ${i + 1}`));
}

function confirmPlayerNames() {
  startPlayersGame(readPlayerNameInputs());
}

function startPlayersGame(names) {
  if (!names.length) return;
  closeSetupModal('playerNamesModal');
  closeSetupModal('playersCountModal');
  startCustomGame('players', names);
}

// Shared entry point for solo and players modes: fresh board, custom names, go.
function startCustomGame(mode, names) {
  sessionStorage.setItem(GAME_MODE_KEY, mode);
  sessionStorage.setItem(TEAM_COUNT_KEY, String(names.length));
  sessionStorage.removeItem('ruletaTeams');
  storeCustomNames(names);

  resetBoardAndScores();
  applyGameMode(mode);

  names.forEach((name, i) => {
    teamNames[i] = name;
    const el = document.getElementById(`team-name-${i}`);
    if (el) el.textContent = name;
  });

  startTrivia();
}

// ---- Multijugador por parejas (ruletas) ----
function chooseTeamsMode() {
  goToTeamsSetup();
}

function startTrivia() {
  const intro = document.getElementById('triviaIntro');
  const game = document.getElementById('gameContainer');
  if (intro) intro.classList.add('intro-exiting');
  setTimeout(() => {
    intro?.classList.add('d-none');
    game?.classList.remove('d-none');
    game?.classList.add('game-entering');
    setTimeout(() => game?.classList.remove('game-entering'), 1400);
  }, 220);
  restoreGameState();
  applyGameMode();
}

function shouldStartGamePanel() {
  return new URLSearchParams(window.location.search).get('start') === '1'
    || sessionStorage.getItem('familyTriviaStartGame') === '1';
}

function startGamePanelFromNavigation() {
  if (!shouldStartGamePanel()) return;
  sessionStorage.removeItem('familyTriviaStartGame');
  startTrivia();
}

function highlightActiveButton() {
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, ''); // remove trailing slash if present

  const testBtn = document.querySelector('.nav-btn.test');
  const ruletasBtn = document.querySelector('.nav-btn.ruletas');

  if (!testBtn || !ruletasBtn) return;

  testBtn.classList.remove('active');
  ruletasBtn.classList.remove('active');

  // Keep active navigation state resilient across local paths and static hosting URLs.
  if (pathname.endsWith('ruletas') || pathname.endsWith('ruletas.html') || pathname.includes('/ruletas')) {
    ruletasBtn.classList.add('active');
  } else {
    testBtn.classList.add('active');
  }
}

// ==================== BOARD SETUP ====================
// ruletas.html loads this file without js/questions.js, so guard the categories lookup.
const cols = typeof categories === 'undefined' ? 0 : categories.length;

function buildBoard() {
  const board = document.getElementById('board');
  if (!board) return;
  board.innerHTML = '';

  categories.forEach((title, index) => {
    const heading = document.createElement('div');
    heading.className = 'category';
    heading.textContent = title;
    heading.style.setProperty('--i', index);   // staggered entrance
    board.appendChild(heading);
  });

  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < cols; c++) {
      const btn = document.createElement('div');
      btn.className = 'value';
      btn.id = `btn-${r}-${c}`;
      btn.textContent = values[r];
      btn.style.setProperty('--i', r * cols + c);   // staggered entrance
      // Cells are divs, so make them reachable and operable from the keyboard.
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-label', `${categories[c]}, ${values[r]} puntos`);
      btn.addEventListener('click', () => {
        openQuestion(r, c, btn);
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        btn.click();
      });
      board.appendChild(btn);
    }
  }
}

function getDifficulty(points) {
  if (points <= 250) return 'facil';
  if (points <= 500) return 'media';
  return 'dificil';
}

function setQuestionStatus(message = '') {
  if (!questionStatus) return;
  questionStatus.innerHTML = message;
  questionStatus.classList.toggle('show', Boolean(message));
}

// ==================== DOM ELEMENT REFERENCES ====================
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');
const audioControlsWrap = document.getElementById('audioControls');
const progressWrap = document.getElementById('progressWrap');
const resolveBtn = document.getElementById('resolveBtn');
const optionsDiv = document.getElementById('options');
const questionInfoDiv = document.getElementById('questionInfo');
const questionText = document.getElementById('questionText');
const questionStatus = document.getElementById('questionStatus');
const toggleRevealBtn = document.getElementById('toggleRevealBtn');
const hiddenAnswerDiv = document.getElementById('hiddenAnswer');

// Hint elements
const hintBtn = document.getElementById('hintBtn');
const hintContainer = document.getElementById('hintContainer');
const hintText = document.getElementById('hintText');

// Final overlay and confetti elements
const finalOverlay = document.getElementById('finalOverlay');
const confettiCanvas = document.getElementById('confettiCanvas');
const winnerColorEl = document.getElementById('winnerColor');
const winnerAnnouncementEl = document.getElementById('winnerAnnouncement');
const winnerScoreEl = document.getElementById('winnerScore');
const rankingListEl = document.getElementById('rankingList');
const finalCard = document.getElementById('finalCard');

// ==================== TEAM DATA ====================
const DEFAULT_TEAM_NAMES = ["Equipo Rojo","Equipo Azul","Equipo Verde","Equipo Amarillo","Equipo Morado"];
// First five colours match the classic teams; the rest extend the palette for bigger groups.
const TEAM_PALETTE = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#7c3aed",
  "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#6366f1",
  "#14b8a6", "#d946ef"
];
const teamScores = [0,0,0,0,0];
const teamColors = [...TEAM_PALETTE.slice(0, 5)];
const teamNames = [...DEFAULT_TEAM_NAMES];
let teamCount = DEFAULT_TEAMS;

function teamColorAt(index) {
  return TEAM_PALETTE[index] || `hsl(${(index * 47) % 360} 70% 55%)`;
}

function defaultTeamName(index) {
  if (getGameMode() === 'teams') return DEFAULT_TEAM_NAMES[index] || `Equipo ${index + 1}`;
  return `Jugador ${index + 1}`;
}

const SCORE_ROWS = [[150,-75],[250,-125],[400,-200],[500,-250],[700,-350],[800,-400]];

function teamCardHtml(index) {
  const color = teamColorAt(index);
  // Teams 0-4 get their name colour from CSS; extra players are coloured inline.
  const nameStyle = index < 5 ? '' : ` style="color:${color}"`;
  const scoreRows = SCORE_ROWS.map(([plus, minus]) => `
                <div class="row-buttons">
                  <button class="btn-small green" onclick="adjustScore(${index}, ${plus})">+${plus}</button>
                  <button class="btn-small red" onclick="adjustScore(${index}, ${minus})">${minus}</button>
                </div>`).join('');

  return `
          <div class="col-6 col-sm-4 col-md-4 col-lg team-col" id="team-col-${index}" style="--i:${index}">
            <div class="d-flex flex-column h-100">
              <div class="team-score-header" id="score-top-${index}">0 Pts</div>
              <div class="team flex-grow-1 team--has-header" id="team-${index}">
                <div class="team-name-row">
                  <div class="team-name" id="team-name-${index}"${nameStyle}>${escapeHtml(teamNames[index] || defaultTeamName(index))}</div>
                  <button class="rename-btn" onclick="startRename(${index})" aria-label="Renombrar equipo ${index}"><i class="bi bi-pencil-fill" aria-hidden="true"></i></button>
                </div>
                <div class="comodines">
                  <button type="button" class="comodin verde" onclick="this.classList.toggle('used')" aria-label="Marcar comodín verde como usado">C</button>
                  <button type="button" class="comodin rojo" onclick="this.classList.toggle('used')" aria-label="Marcar comodín rojo como usado">C</button>
                  <button type="button" class="comodin morado" onclick="this.classList.toggle('used')" aria-label="Marcar comodín morado como usado">C</button>
                </div>
                <div class="score-buttons">${scoreRows}
                  <div class="reset-wrapper">
                    <button class="btn-small reset" onclick="resetTeam(${index})">Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
}

function renderTeamCards() {
  const container = document.getElementById('teamsContainer');
  if (!container) return;

  container.innerHTML = Array.from({ length: teamCount }, (_, i) => teamCardHtml(i)).join('');

  container.classList.add('cards-entering');
  clearTimeout(renderTeamCards._timer);
  renderTeamCards._timer = setTimeout(
    () => container.classList.remove('cards-entering'),
    500 + teamCount * 55
  );

  container.querySelectorAll('.comodin').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(saveGameState, 0));
  });

  for (let i = 0; i < teamCount; i++) renderScore(i);
  applyTeamNeonBorders();
}

// Resizes every per-team array and rebuilds the scoreboard cards.
function setTeamCount(count) {
  teamCount = Math.max(1, Math.min(MAX_PLAYERS, count));

  for (let i = 0; i < teamCount; i++) {
    if (typeof teamScores[i] !== 'number') teamScores[i] = 0;
    if (!teamNames[i]) teamNames[i] = defaultTeamName(i);
    teamColors[i] = teamColorAt(i);
  }
  teamScores.length = teamCount;
  teamNames.length = teamCount;
  teamColors.length = teamCount;

  if (!Array.isArray(scoreHistory) || !scoreHistory.length || scoreHistory[0].length !== teamCount) {
    scoreHistory = [new Array(teamCount).fill(0)];
  }

  renderTeamCards();
}

function persistTeamName(teamIndex, name) {
  if (getGameMode() !== 'teams') {
    const names = getCustomNames();
    names[teamIndex] = name;
    storeCustomNames(names);
    return;
  }

  const saved = JSON.parse(localStorage.getItem('ruletaTeamNames') || '{}');
  saved[teamIndex] = name;
  localStorage.setItem('ruletaTeamNames', JSON.stringify(saved));

  const teams = JSON.parse(sessionStorage.getItem('ruletaTeams') || '[]');
  if (teamIndex < teams.length) {
    teams[teamIndex] = name;
    sessionStorage.setItem('ruletaTeams', JSON.stringify(teams));
  }
}

function syncTeamNamesFromStorage(gameStateNames) {
  const mode = getGameMode();

  if (mode !== 'teams') {
    const custom = getCustomNames();
    for (let i = 0; i < teamCount; i++) {
      teamNames[i] = custom[i] || gameStateNames?.[i] || defaultTeamName(i);
      const el = document.getElementById(`team-name-${i}`);
      if (el) el.textContent = teamNames[i];
    }
    return;
  }

  const savedTeams = JSON.parse(localStorage.getItem('ruletaTeamNames') || '{}');
  const formedTeams = JSON.parse(sessionStorage.getItem('ruletaTeams') || '[]');
  const forceDefaults = Object.keys(savedTeams).length === 0 && formedTeams.length === 0;

  for (let i = 0; i < teamCount; i++) {
    if (forceDefaults) {
      teamNames[i] = defaultTeamName(i);
    } else if (savedTeams[i]) {
      teamNames[i] = savedTeams[i];
    } else if (gameStateNames?.[i]) {
      teamNames[i] = gameStateNames[i];
    } else {
      teamNames[i] = defaultTeamName(i);
    }
    const el = document.getElementById(`team-name-${i}`);
    if (el) el.textContent = teamNames[i];
  }
}

// ==================== VOLUME CONTROL ====================
let volumeSlider = null;
let volumeIcon = null;
let currentAudioVolume = 0.85;

function updateVolumeIcon() {
  if (!volumeIcon || !audio) return;
  
  if (audio.volume === 0) {
    volumeIcon.textContent = '🔇';
  } else if (audio.volume < 0.3) {
    volumeIcon.textContent = '🔈';
  } else if (audio.volume < 0.65) {
    volumeIcon.textContent = '🔉';
  } else {
    volumeIcon.textContent = '🔊';
  }
}

function initVolumeControl() {
  // Audio question markup is rebuilt per modal open, so refresh element references each time.
  volumeSlider = document.getElementById('volumeSlider');
  volumeIcon = document.getElementById('volumeIcon');

  if (!volumeSlider || !audio) {
    return;
  }

  audio.volume = currentAudioVolume;
  volumeSlider.value = currentAudioVolume;
  updateVolumeIcon();

  // Keep the audio element and slider value synchronized.
  const inputHandler = () => {
    currentAudioVolume = parseFloat(volumeSlider.value);
    audio.volume = currentAudioVolume;
    updateVolumeIcon();
  };

  if (volumeSlider._inputHandler) volumeSlider.removeEventListener('input', volumeSlider._inputHandler);
  volumeSlider._inputHandler = inputHandler;
  volumeSlider.addEventListener('input', inputHandler);

  // Toggle mute from the volume icon while preserving the previous volume.
  if (volumeIcon) {
    const clickHandler = () => {
      if (audio.volume > 0) {
        audio.dataset.lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
      } else {
        const lastVol = parseFloat(audio.dataset.lastVolume) || 0.85;
        audio.volume = lastVol;
        volumeSlider.value = lastVol;
        currentAudioVolume = lastVol;
      }
      updateVolumeIcon();
    };

    if (volumeIcon._clickHandler) volumeIcon.removeEventListener('click', volumeIcon._clickHandler);
    volumeIcon._clickHandler = clickHandler;
    volumeIcon.addEventListener('click', clickHandler);
  }
}

// ==================== SCORE MANAGEMENT ====================
function renderScore(teamIndex) {
  const text = `${teamScores[teamIndex]} Pts`;
  const el = document.getElementById(`score-${teamIndex}`);
  if (el) el.innerText = text;
  const top = document.getElementById(`score-top-${teamIndex}`);
  if (top) top.innerText = text;
}

function animateScoreChange(teamIndex, delta) {
  const targets = [
    document.getElementById(`score-${teamIndex}`),
    document.getElementById(`score-top-${teamIndex}`)
  ].filter(Boolean);
  const cls = delta >= 0 ? 'score-flash-up' : 'score-flash-down';

  targets.forEach(el => {
    el.classList.remove('score-flash-up', 'score-flash-down');
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  });
}

function applyTeamNeonBorders() {
  for (let i = 0; i < teamScores.length; i++) {
    const teamEl = document.getElementById(`team-${i}`);
    const headerEl = document.getElementById(`score-top-${i}`);
    if (!teamEl) continue;
    const color = teamColors[i] || '#fff';
    teamEl.style.borderColor = color;
    teamEl.style.boxShadow = `0 8px 30px rgba(0,0,0,0.45), 0 0 18px ${hexToRgba(color,0.12)}`;
    if (headerEl) {
      headerEl.style.borderColor = color;
      headerEl.style.boxShadow = `0 0 18px ${hexToRgba(color,0.12)}`;
    }
  }
}

// Renders trackName with the movie title in bold. Format: "Title\n\nExplanation"
function setTrackNameHtml(el, trackName) {
  const idx = trackName.indexOf('\n\n');
  if (idx === -1) {
    el.innerHTML = `<strong>${escapeHtml(trackName)}</strong>`;
  } else {
    const title = trackName.slice(0, idx);
    const body  = escapeHtml(trackName.slice(idx + 2)).replace(/\n/g, '<br>');
    el.innerHTML = `<strong>${escapeHtml(title)}</strong><br><br>${body}`;
  }
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#','');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function adjustScore(teamIndex, delta) {
  if (typeof teamIndex !== 'number' || teamIndex < 0 || teamIndex >= teamCount) return;
  teamScores[teamIndex] += delta;
  renderScore(teamIndex);
  animateScoreChange(teamIndex, delta);
  if (lastPlayedCategory && lastQuestionResolved) {
    if (!categoryStats[lastPlayedCategory]) categoryStats[lastPlayedCategory] = {};
    categoryStats[lastPlayedCategory][teamIndex] = (categoryStats[lastPlayedCategory][teamIndex] || 0) + delta;
  }
  saveGameState();
}

function resetTeam(teamIndex) {
  if (typeof teamIndex !== 'number' || teamIndex < 0 || teamIndex >= teamCount) return;
  teamScores[teamIndex] = 0;
  renderScore(teamIndex);
  saveGameState();
}

function resetAllScores() {
  for (let i = 0; i < teamScores.length; i++) {
    teamScores[i] = 0;
    renderScore(i);
  }
  categoryStats = {};
  scoreHistory = [new Array(teamCount).fill(0)];
  lastPlayedCategory = null;
  lastQuestionResolved = false;
  if (finalChart) { finalChart.destroy(); finalChart = null; }
  const statsPanel = document.getElementById('statsPanel');
  if (statsPanel) { statsPanel.innerHTML = ''; statsPanel.style.display = 'none'; }
  const rankingList = document.getElementById('rankingList');
  if (rankingList) rankingList.style.display = 'block';
  const toggleBtn = document.getElementById('toggleStatsBtn');
  if (toggleBtn) { toggleBtn.style.display = 'none'; toggleBtn.innerHTML = '📊 Ver estadísticas'; }
  saveGameState();
}

// ==================== AUDIO CONTROLS ====================
function formatTime(sec) {
  if (!isFinite(sec) || sec <= 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function updateProgressUI() {
  if (!audio || !progressBar || !progressFill || !progressHandle || !currentTimeLabel || !totalTimeLabel) return;
  const dur = audio.duration || 0;
  const cur = audio.currentTime || 0;
  const pct = dur ? (cur / dur) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressHandle.style.left = pct + '%';
  currentTimeLabel.innerText = formatTime(cur);
  totalTimeLabel.innerText = formatTime(dur);
}

function resetAudioControls() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (playBtn) {
    playBtn.style.display = 'none';
    playBtn.disabled = false;
  }
  if (pauseBtn) {
    pauseBtn.style.display = 'none';
    pauseBtn.disabled = true;
  }
  updateProgressUI();
}

// ==================== INDEX PAGE INIT ====================
function initIndexPage() {
  if (!document.getElementById('overlay')) return;

  syncTeamNamesFromStorage();

  for (let i = 0; i < teamScores.length; i++) renderScore(i);
  applyTeamNeonBorders();

  if (playBtn && pauseBtn && audio) {
    const attachListeners = () => {
      playBtn.onclick = () => {
        audio.play().catch(() => {});
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        playBtn.disabled = true;
        pauseBtn.disabled = false;
      };
      pauseBtn.onclick = () => {
        audio.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        playBtn.disabled = false;
        pauseBtn.disabled = true;
      };
    };
    attachListeners();
    audio.addEventListener('timeupdate', updateProgressUI);
    audio.addEventListener('loadedmetadata', updateProgressUI);
    audio.addEventListener('ended', () => {
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      updateProgressUI();
    });
    // Re-attach playBtn/pauseBtn onclick handlers on overlay click in case they were lost
    document.addEventListener('click', (e) => {
      if (e.target.closest('#overlay') && playBtn.style.display === 'none') {
        attachListeners();
      }
    });
  }

  resetAudioControls();

  if (toggleRevealBtn) {
    toggleRevealBtn.addEventListener('click', () => {
      if (!currentQuestion || !currentQuestion.trackName || currentRow === null || currentCol === null) return;

      const cellKey = `${currentRow}-${currentCol}`;
      const isShown = hiddenAnswerDiv && hiddenAnswerDiv.style.display === 'block';

      if (!isShown) {
        // Reveal the soundtrack answer and lock the board cell as completed.
        setTrackNameHtml(hiddenAnswerDiv, currentQuestion.trackName);
        hiddenAnswerDiv.style.display = 'block';
        hiddenAnswerDiv.setAttribute('aria-hidden', 'false');
        document.getElementById('toggleRevealText').textContent = 'Ocultar película';

        revealedAudioCells.add(cellKey);
        lastQuestionResolved = true;

        if (currentButton) {
          currentButton.classList.add('disabled');
          currentButton.setAttribute('aria-disabled', 'true');
        }
        saveGameState();
      } else {
        // Hide the answer but keep the cell locked so it can still be reopened to review.
        hiddenAnswerDiv.innerText = '';
        hiddenAnswerDiv.style.display = 'none';
        hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
        document.getElementById('toggleRevealText').textContent = 'Revelar película';

        revealedAudioCells.delete(cellKey);
        saveGameState();
      }
    });
  }

  // Seek by clicking or dragging the progress bar.
  if (progressBar) {
    const seekToPointer = (e) => {
      if (!audio || !audio.duration || isNaN(audio.duration) || !isFinite(audio.duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));

      audio.currentTime = percentage * audio.duration;
      updateProgressUI();
    };

    progressBar.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      seekToPointer(e);
      progressBar.setPointerCapture?.(e.pointerId);

      const onMove = (moveEvent) => seekToPointer(moveEvent);
      const onUp = (upEvent) => {
        seekToPointer(upEvent);
        progressBar.releasePointerCapture?.(upEvent.pointerId);
        progressBar.removeEventListener('pointermove', onMove);
        progressBar.removeEventListener('pointerup', onUp);
        progressBar.removeEventListener('pointercancel', onUp);
      };

      progressBar.addEventListener('pointermove', onMove);
      progressBar.addEventListener('pointerup', onUp);
      progressBar.addEventListener('pointercancel', onUp);
    });
  }

  if (document.getElementById('overlay')) {
    document.getElementById('overlay').addEventListener('click', (e) => {
      if (e.target.id === 'overlay') closeOverlay();
    });
  }

  if (finalOverlay) {
    finalOverlay.addEventListener('click', (e) => {
      if (e.target === finalOverlay) closeFinalOverlay();
    });
  }

  // Refresh button: swap the current cell question without resetting the board.
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.onclick = changeCurrentQuestion;
  }
}

// ==================== QUESTION STATE ====================
let selectedOption = null;
let currentCorrect = null;
let currentButton = null;
let currentRow = null;
let currentCol = null;
let currentQuestion = null;

// Stores the question assigned to each board cell so reopening a cell is deterministic.
const assignedQuestions = {};   // key: "row-col" -> question object
// Tracks revealed soundtrack answers for audio categories.
const revealedAudioCells = new Set();   // keys: "row-col"
// Persistent state for non-audio questions: visible explanation and selected option.
let cellStates = {};   // key: "row-col" -> { explanationVisible: boolean, selectedOption: number|null }
let audioPositions = {};  // key: "row-col" -> saved audio playback position in seconds
let lastPlayedCategory = null;
let lastQuestionResolved = false;
let categoryStats = {};   // { 'Category': { 0: 150, 1: -75, ... }, ... }
let scoreHistory = [[0, 0, 0, 0, 0]]; // Score snapshots after each adjustment, used by the final progression chart.
let finalChart = null;
// Used questions by category and difficulty to avoid repeats within each pool.
let usedQuestionsByPool = {};   // key: "Category-difficulty" -> Set of used question objects

// ==================== GAME STATE PERSISTENCE ====================
const GAME_STATE_KEY = 'familyTriviaGameState';

function getNavigationType() {
  return (performance.getEntriesByType?.('navigation')?.[0]?.type)
    ?? (performance.navigation?.type === 1 ? 'reload' : 'navigate');
}

function clearGameProgress() {
  sessionStorage.removeItem(GAME_STATE_KEY);
}

function clearSavedGame() {
  clearGameProgress();
  sessionStorage.removeItem('ruletaTeams');
  sessionStorage.removeItem(GAME_MODE_KEY);
  sessionStorage.removeItem(TEAM_COUNT_KEY);
  sessionStorage.removeItem(CUSTOM_NAMES_KEY);
  localStorage.removeItem('ruletaTeamNames');
}

function clearSavedGameOnReload() {
  if (getNavigationType() === 'reload') clearSavedGame();
}

function isIndexGamePage() {
  return Boolean(document.getElementById('board') && document.getElementById('gameContainer'));
}

function getPoolKeyFromCell(cellKey) {
  const [row, col] = cellKey.split('-').map(Number);
  const categoryName = categories[col];
  const points = values[row];
  if (!categoryName || !points) return null;
  const difficulty = getDifficulty(points);
  return { categoryName, difficulty, poolKey: `${categoryName}-${difficulty}` };
}

function getQuestionRef(question, cellKey) {
  const info = getPoolKeyFromCell(cellKey);
  if (!info) return null;
  const pool = questionPools[info.categoryName]?.[info.difficulty] || [];
  const index = pool.findIndex(q =>
    q === question ||
    (
      q.pregunta === question?.pregunta &&
      q.audio === question?.audio &&
      q.explicacion === question?.explicacion &&
      q.trackName === question?.trackName
    )
  );
  return index === -1 ? null : { ...info, index };
}

function rebuildUsedQuestionsByPool() {
  usedQuestionsByPool = {};
  Object.entries(assignedQuestions).forEach(([cellKey, question]) => {
    const info = getPoolKeyFromCell(cellKey);
    if (!info || !question) return;
    if (!usedQuestionsByPool[info.poolKey]) usedQuestionsByPool[info.poolKey] = new Set();
    usedQuestionsByPool[info.poolKey].add(question);
  });
}

function getUsedComodinesState() {
  return teamScores.map((_, teamIndex) => ({
    verde: Boolean(document.querySelector(`#team-${teamIndex} .comodin.verde`)?.classList.contains('used')),
    rojo: Boolean(document.querySelector(`#team-${teamIndex} .comodin.rojo`)?.classList.contains('used')),
    morado: Boolean(document.querySelector(`#team-${teamIndex} .comodin.morado`)?.classList.contains('used'))
  }));
}

function applyUsedComodinesState(usedComodines = []) {
  usedComodines.forEach((state, teamIndex) => {
    ['verde', 'rojo', 'morado'].forEach(color => {
      const el = document.querySelector(`#team-${teamIndex} .comodin.${color}`);
      if (el) el.classList.toggle('used', Boolean(state?.[color]));
    });
  });
}

function saveGameState() {
  if (!isIndexGamePage()) return;

  const assignedQuestionRefs = {};
  Object.entries(assignedQuestions).forEach(([cellKey, question]) => {
    const ref = getQuestionRef(question, cellKey);
    if (ref) assignedQuestionRefs[cellKey] = ref;
  });

  sessionStorage.setItem(GAME_STATE_KEY, JSON.stringify({
    teamCount,
    teamScores: [...teamScores],
    teamNames: [...teamNames],
    assignedQuestionRefs,
    revealedAudioCells: [...revealedAudioCells],
    cellStates,
    audioPositions,
    categoryStats,
    scoreHistory,
    lastPlayedCategory,
    lastQuestionResolved,
    usedComodines: getUsedComodinesState()
  }));
}

function restoreGameState() {
  if (!isIndexGamePage()) return;

  const raw = sessionStorage.getItem(GAME_STATE_KEY);
  if (!raw) return;

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(GAME_STATE_KEY);
    return;
  }

  const savedCount = Number(state.teamCount) || (Array.isArray(state.teamScores) ? state.teamScores.length : teamCount);
  if (savedCount !== teamCount) setTeamCount(savedCount);

  if (Array.isArray(state.teamScores)) {
    state.teamScores.forEach((score, index) => {
      if (index < teamScores.length) teamScores[index] = Number(score) || 0;
    });
  }

  const gameStateNames = Array.isArray(state.teamNames) ? state.teamNames : null;

  Object.keys(assignedQuestions).forEach(key => delete assignedQuestions[key]);
  Object.entries(state.assignedQuestionRefs || {}).forEach(([cellKey, ref]) => {
    const question = questionPools[ref.categoryName]?.[ref.difficulty]?.[ref.index];
    if (question) assignedQuestions[cellKey] = question;
  });

  revealedAudioCells.clear();
  (state.revealedAudioCells || []).forEach(cellKey => revealedAudioCells.add(cellKey));

  cellStates = state.cellStates || {};
  audioPositions = state.audioPositions || {};
  categoryStats = state.categoryStats || {};
  scoreHistory = Array.isArray(state.scoreHistory) && state.scoreHistory.length ? state.scoreHistory : [new Array(teamCount).fill(0)];
  lastPlayedCategory = state.lastPlayedCategory || null;
  lastQuestionResolved = Boolean(state.lastQuestionResolved);

  rebuildUsedQuestionsByPool();

  syncTeamNamesFromStorage(gameStateNames);

  for (let i = 0; i < teamScores.length; i++) renderScore(i);

  Object.keys(assignedQuestions).forEach(cellKey => {
    const btn = document.getElementById(`btn-${cellKey}`);
    if (!btn) return;
    const isResolved = Boolean(cellStates[cellKey]?.explanationVisible || revealedAudioCells.has(cellKey));
    btn.classList.toggle('disabled', isResolved);
    if (isResolved) {
      btn.setAttribute('aria-disabled', 'true');
    } else {
      btn.removeAttribute('aria-disabled');
    }
  });

  applyUsedComodinesState(state.usedComodines);
  applyTeamNeonBorders();
}

// ==================== QUESTION LOGIC ====================
function openQuestion(row, col, btnElement) {
  if (!questionText || !optionsDiv || !resolveBtn || !audioControlsWrap || !progressWrap) return;
  setQuestionStatus('');

  const categoryName = categories[col];
  const points = values[row];
  const difficulty = getDifficulty(points);
  const poolKey = `${categoryName}-${difficulty}`;
  const cellKey = `${row}-${col}`;

  let q;

  if (assignedQuestions[cellKey]) {
    q = assignedQuestions[cellKey];
  } else {
    let pool = questionPools[categoryName] && questionPools[categoryName][difficulty];
    if (!pool || pool.length === 0) {
      currentButton = btnElement;
      currentRow = row;
      currentCol = col;
      currentQuestion = null;
      currentCorrect = null;
      selectedOption = null;
      if (questionInfoDiv) questionInfoDiv.innerText = `${categoryName} - ${points} Puntos`;
      questionText.innerText = 'No hay preguntas disponibles';
      optionsDiv.innerHTML = '';
      setQuestionStatus(`No hay preguntas configuradas para <strong>${escapeHtml(categoryName)}</strong> en dificultad <strong>${escapeHtml(difficulty)}</strong>.`);
      if (hintContainer) hintContainer.classList.remove('show');
      if (hintBtn) hintBtn.classList.remove('active');
      if (audioControlsWrap) audioControlsWrap.style.display = 'none';
      if (progressWrap) progressWrap.style.display = 'none';
      if (resolveBtn) resolveBtn.style.display = 'none';
      if (toggleRevealBtn) toggleRevealBtn.style.display = 'none';
      if (hiddenAnswerDiv) {
        hiddenAnswerDiv.innerText = '';
        hiddenAnswerDiv.style.display = 'none';
      }
      const explanationEl = document.getElementById('explanation');
      if (explanationEl) {
        explanationEl.classList.remove('explanation-visible');
        explanationEl.innerText = '';
        explanationEl.style.display = 'none';
      }
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      showQuestionOverlay();
      return;
    }

    if (!usedQuestionsByPool[poolKey]) usedQuestionsByPool[poolKey] = new Set();
    const usedSet = usedQuestionsByPool[poolKey];

    let available = pool.filter(question => !usedSet.has(question));

    if (available.length === 0) {
      usedSet.clear();
      available = [...pool];
      setQuestionStatus(`Te has quedado sin preguntas de <strong>${escapeHtml(categoryName)}</strong> (${escapeHtml(difficulty)}). Se ha reiniciado solo este grupo para poder seguir jugando.`);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    q = available[randomIndex];

    usedSet.add(q);
    assignedQuestions[cellKey] = q;
    saveGameState();
  }

  currentQuestion = q;

  const isAlreadyRevealed = revealedAudioCells.has(cellKey);
  const savedState = cellStates[cellKey];

  questionText.innerText = q ? q.pregunta || '' : '';
  optionsDiv.innerHTML = '';

  selectedOption = null;
  currentCorrect = q.correcta ?? null;
  if (lastPlayedCategory !== null) scoreHistory.push([...teamScores]);
  currentButton = btnElement;
  currentRow = row;
  currentCol = col;
  lastPlayedCategory = categories[col];
  lastQuestionResolved = false;

  if (questionInfoDiv) {
    questionInfoDiv.innerText = `${categoryName} - ${points} Puntos`;
  }

  // Hint handling
  if (hintBtn && hintContainer && hintText) {
    hintContainer.classList.remove('show');
    hintBtn.classList.remove('active');
    hintText.innerHTML = q.pista || "Piensa en algo relacionado con la categoría...";

    hintBtn.onclick = () => {
      const showing = hintContainer.classList.toggle('show');
      hintBtn.classList.toggle('active', showing);
      hintText.innerHTML = q.pista || '';
    };
  }

  // Audio question mode (Bandas sonoras / Disney)
  const isAudioQuestion = (categoryName === 'Bandas sonoras' || categoryName === 'Disney') && q && q.audio;

  if (isAudioQuestion) {
    if (resolveBtn) resolveBtn.style.display = 'none';
    if (toggleRevealBtn) toggleRevealBtn.style.display = 'inline-block';
    audioControlsWrap.style.display = 'block';
    audioControlsWrap.classList.remove('explanation-only');
    progressWrap.style.display = 'flex';
    audioControlsWrap.classList.add('audio-question');

    if (audio) {
      audio.src = q.audio;
      audio.load();
      audio.pause();
      audio.currentTime = audioPositions[cellKey] || 0;
    }

    if (playBtn) playBtn.style.display = 'block';
    if (pauseBtn) pauseBtn.style.display = 'none';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    updateProgressUI();

    if (hiddenAnswerDiv) {
      hiddenAnswerDiv.style.display = 'none';
      hiddenAnswerDiv.innerText = '';
      hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
    }

    const explanationEl = document.getElementById('explanation');
    if (explanationEl) {
      explanationEl.classList.remove('explanation-visible');
      explanationEl.style.display = 'none';
    }
    if (toggleRevealBtn) {
      document.getElementById('toggleRevealText').textContent = 'Revelar película';
    }

    initVolumeControl();

    // Restore revealed state when reopening an audio cell.
    if (isAlreadyRevealed && hiddenAnswerDiv && toggleRevealBtn) {
      setTrackNameHtml(hiddenAnswerDiv, q.trackName);
      hiddenAnswerDiv.style.display = 'block';
      hiddenAnswerDiv.setAttribute('aria-hidden', 'false');
      document.getElementById('toggleRevealText').textContent = 'Ocultar película';
    }

  } else {
    // Standard question mode, including clean riddle screens.
    audioControlsWrap.style.display = 'block';
    audioControlsWrap.classList.add('explanation-only');
    progressWrap.style.display = 'none';
    if (resolveBtn) resolveBtn.style.display = 'inline-block';
    if (toggleRevealBtn) toggleRevealBtn.style.display = 'none';

    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }

    // Render options only for multiple-choice questions, not riddles.
    if (categoryName !== 'Adivinanzas' && q && Array.isArray(q.opciones)) {

      const letterCategories = ['Cultura general', 'Actualidad', 'Geografía'];
      const isLetterCategory = letterCategories.includes(categoryName);

      q.opciones.forEach((op, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.index = index;

        if (isLetterCategory && index < 4) {
          const letters = ['A', 'B', 'C', 'D'];
          div.innerHTML = `
            <div class="option-letter ${letters[index]}">${letters[index]}</div>
            <span class="option-text">${escapeHtml(op)}</span>
          `;
        } else {
          div.innerText = op;
        }

        div.onclick = () => {
          if (cellStates[cellKey]?.explanationVisible) return;
          document.querySelectorAll('.option').forEach(o => {
            o.classList.remove('selected', 'incorrect', 'correct');
          });
          div.classList.add('selected');
          selectedOption = index;
        };

        optionsDiv.appendChild(div);
      });
    } else {
      optionsDiv.innerHTML = ''; // Keep riddle questions option-free.
    }

    // Restore state when reopening an already resolved cell.
    if (savedState && savedState.explanationVisible) {
      const explanationEl = document.getElementById('explanation');
      if (explanationEl && currentQuestion && currentQuestion.explicacion) {
        explanationEl.innerText = currentQuestion.explicacion;
        explanationEl.classList.add('explanation-visible');
        explanationEl.style.display = 'block';
        explanationEl.style.opacity = '1';
        explanationEl.style.visibility = 'visible';
        explanationEl.setAttribute('aria-hidden', 'false');
      }

      const options = document.querySelectorAll('.option');
      if (options.length > 0) {
        if (currentCorrect !== null && options[currentCorrect]) options[currentCorrect].classList.add('correct');
        if (savedState.selectedOption !== null && savedState.selectedOption !== currentCorrect && options[savedState.selectedOption]) {
          options[savedState.selectedOption].classList.add('incorrect');
        }
      }

      const resolveBtnText = document.getElementById('resolveBtnText');
      if (resolveBtnText) resolveBtnText.textContent = 'Ocultar respuesta';
      if (resolveBtn) {
        const resolveIcon = resolveBtn.querySelector('i');
        if (resolveIcon) resolveIcon.classList.replace('bi-unlock-fill', 'bi-lock-fill');
      }
    } else {
      const resolveBtnText = document.getElementById('resolveBtnText');
      if (resolveBtnText) resolveBtnText.textContent = 'Resolver';
      if (resolveBtn) {
        const resolveIcon = resolveBtn.querySelector('i');
        if (resolveIcon) resolveIcon.classList.replace('bi-lock-fill', 'bi-unlock-fill');
      }
    }
  }

  showQuestionOverlay();
}

function showQuestionOverlay() {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.classList.remove('overlay-closing');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('overlay-open'));
}

function resolveQuestion() {
  const explanationEl = document.getElementById('explanation');
  if (!explanationEl) return;

  const cellKey = `${currentRow}-${currentCol}`;

  if (explanationEl.classList.contains('explanation-visible')) {
    // hide explanation
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('.option').forEach(opt => {
      opt.classList.remove('correct', 'incorrect');
    });

    if (cellStates[cellKey]) {
      cellStates[cellKey].explanationVisible = false;
    }

    const resolveBtnText = document.getElementById('resolveBtnText');
    if (resolveBtnText) resolveBtnText.textContent = 'Resolver';
    const resolveIcon = resolveBtn.querySelector('i');
    if (resolveIcon) { resolveIcon.classList.replace('bi-lock-fill', 'bi-unlock-fill'); }
    saveGameState();
    return;
  }

  // Show the explanation and mark correct/incorrect options.
  if (currentButton) {
    currentButton.classList.add('disabled');
    currentButton.classList.add('cell-used-pop');
    currentButton.addEventListener('animationend', () => currentButton?.classList.remove('cell-used-pop'), { once: true });
    currentButton.setAttribute('aria-disabled', 'true');
  }

  if (currentQuestion && currentQuestion.explicacion) {
    explanationEl.innerText = currentQuestion.explicacion;
    explanationEl.classList.add('explanation-visible');
    explanationEl.style.display = 'block';
    explanationEl.style.opacity = '1';
    explanationEl.style.visibility = 'visible';
    explanationEl.setAttribute('aria-hidden', 'false');
  }

  const resolveBtnText = document.getElementById('resolveBtnText');
  if (resolveBtnText) resolveBtnText.textContent = 'Ocultar respuesta';
  const resolveIcon = resolveBtn.querySelector('i');
  if (resolveIcon) { resolveIcon.classList.replace('bi-unlock-fill', 'bi-lock-fill'); }

  // Mark answer options according to the selected and correct values.
  const options = document.querySelectorAll('.option');
  if (options.length > 0) {
    if (currentCorrect !== null && options[currentCorrect]) {
      options[currentCorrect].classList.add('correct');
    }
    if (selectedOption !== null && selectedOption !== currentCorrect && options[selectedOption]) {
      options[selectedOption].classList.add('incorrect');
    }
  }

  // Persist the resolved state so reopening the modal is consistent.
  if (!cellStates[cellKey]) cellStates[cellKey] = {};
  cellStates[cellKey].explanationVisible = true;
  cellStates[cellKey].selectedOption = selectedOption;
  lastQuestionResolved = true;
  saveGameState();
}

// ==================== QUESTION REFRESH ====================
function changeCurrentQuestion() {
  if (currentRow === null || currentCol === null) return;

  const categoryName = categories[currentCol];
  const cellKey = `${currentRow}-${currentCol}`;

  // Remove the assigned question so a new one is selected.
  delete assignedQuestions[cellKey];

  // Clear all persisted UI state for this cell.
  delete cellStates[cellKey];
  delete audioPositions[cellKey];
  
  // Audio cells also need their revealed-answer state cleared.
  if ((categoryName === 'Bandas sonoras' || categoryName === 'Disney') && revealedAudioCells) {
    revealedAudioCells.delete(cellKey);
  }

  // Re-enable the board cell before reopening it.
  if (currentButton) {
    currentButton.classList.remove('disabled');
    currentButton.removeAttribute('aria-disabled');
  }

  // Reset current modal UI state.
  selectedOption = null;

  const optionsDivEl = document.getElementById('options');
  if (optionsDivEl) optionsDivEl.innerHTML = '';

  const explanationEl = document.getElementById('explanation');
  if (explanationEl) {
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.setAttribute('aria-hidden', 'true');
  }

  // Reopen the same cell with a fresh question.
  openQuestion(currentRow, currentCol, currentButton);
  saveGameState();
}

function closeOverlay() {
  if (audio && currentRow !== null && currentCol !== null && audio.currentTime > 0 && !isNaN(audio.currentTime)) {
    audioPositions[`${currentRow}-${currentCol}`] = audio.currentTime;
  }
  currentQuestion = null;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    audio.load();
  }
  resetAudioControls();
  if (audioControlsWrap) {
    audioControlsWrap.style.display = 'none';
    audioControlsWrap.classList.remove('explanation-only');
  }
  if (progressWrap) progressWrap.style.display = 'none';
  if (resolveBtn) resolveBtn.style.display = 'inline-block';
  if (toggleRevealBtn) toggleRevealBtn.style.display = 'none';
  const resolveBtnText = document.getElementById('resolveBtnText');
  if (resolveBtnText) resolveBtnText.textContent = 'Resolver';
  if (resolveBtn) { const i = resolveBtn.querySelector('i'); if (i) i.classList.replace('bi-lock-fill', 'bi-unlock-fill'); }
  
  // Hide and clear ALL overlay content elements
  const explanationEl = document.getElementById('explanation');
  if (explanationEl) {
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.style.minHeight = '0px';
    explanationEl.style.opacity = '0';
    explanationEl.setAttribute('aria-hidden', 'true');
  }
  
  if (hiddenAnswerDiv) {
    hiddenAnswerDiv.style.display = 'none';
    hiddenAnswerDiv.innerText = '';
    hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
  }

  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('overlay-open');
    overlay.classList.add('overlay-closing');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('overlay-closing');
    }, 220);
  }

  if (hintContainer) hintContainer.classList.remove('show');
  if (hintBtn) hintBtn.classList.remove('active');
  if (hintText) hintText.innerHTML = '';

  audioControlsWrap.classList.remove('audio-question');
  saveGameState();
}

function showFinalRanking() {
  if (!winnerColorEl || !winnerAnnouncementEl || !winnerScoreEl || !rankingListEl || !finalCard || !finalOverlay) return;

  const teams = teamScores.map((s, i) => ({
    index: i,
    name: teamNames[i],
    score: s,
    color: teamColors[i]
  }));

  teams.sort((a, b) => b.score - a.score);
  const winner = teams[0];

  winnerColorEl.style.background = winner.color;
  winnerColorEl.style.boxShadow = `0 0 40px ${hexToRgba(winner.color, 0.7)}, 0 0 80px ${hexToRgba(winner.color, 0.4)}, 0 10px 40px rgba(0,0,0,0.6)`;
  winnerAnnouncementEl.innerText = teamCount === 1
    ? `🏆 ¡BIEN HECHO, ${winner.name.toUpperCase()}! 🏆`
    : `🏆 ¡${winner.name.toUpperCase()} GANA LA PARTIDA! 🏆`;
  winnerScoreEl.innerText = `0 Pts`;
  finalCard.style.borderColor = winner.color;
  finalCard.style.boxShadow = `0 28px 100px rgba(0,0,0,0.85), 0 0 40px ${hexToRgba(winner.color, 0.18)}`;

  // Tint action buttons with winner color
  const finalActionBtns = document.querySelectorAll('#finalOverlay .final-actions button, #finalOverlay .final-actions .btn');
  finalActionBtns.forEach(btn => {
    btn.style.backgroundColor = winner.color;
    btn.style.color = '#fff';           // Ensure readable text over team colors.
  });

  rankingListEl.innerHTML = '';
  teams.forEach((t, idx) => {
    const div = document.createElement('div');
    div.className = 'rank-item';
    div.style.animationDelay = `${idx * 85}ms`;
    div.innerHTML = `<div class="rank-item-content"><div class="rank-item-icon" style="background:${t.color}"></div><div class="rank-name">${idx+1}. ${escapeHtml(t.name)}</div></div><div class="rank-score">${t.score} Pts</div>`;
    rankingListEl.appendChild(div);
  });

  scoreHistory.push([...teamScores]);

  // ==================== FINAL STATISTICS ====================
  const statsPanel = document.getElementById('statsPanel');
  const toggleBtn = document.getElementById('toggleStatsBtn');
  if (statsPanel) {
    statsPanel.innerHTML = '';
    statsPanel.style.display = 'none';
    if (rankingListEl) rankingListEl.style.display = 'block';
    if (toggleBtn) toggleBtn.innerHTML = '📊 Ver estadísticas';

    const hasCatData = categories.some(cat => categoryStats[cat]);
    const hasHistory = scoreHistory.length > 1;
    if (toggleBtn) toggleBtn.style.display = (hasCatData || hasHistory) ? 'inline-block' : 'none';

    // Score progression chart
    if (finalChart) { finalChart.destroy(); finalChart = null; }
    if (hasHistory && typeof Chart !== 'undefined') {
      const chartWrap = document.createElement('div');
      chartWrap.className = 'stat-chart-wrap';
      const canvas = document.createElement('canvas');
      chartWrap.appendChild(canvas);
      statsPanel.appendChild(chartWrap);

      finalChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: scoreHistory.map((_, i) => i === 0 ? 'Inicio' : i === scoreHistory.length - 1 ? 'Final' : `P${i}`),
          datasets: teamNames.map((name, idx) => ({
            label: name.replace('Equipo ', ''),
            data: scoreHistory.map(s => s[idx]),
            borderColor: teamColors[idx],
            backgroundColor: hexToRgba(teamColors[idx], 0.08),
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: false,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#fff', font: { family: 'Poppins', size: 12 }, boxWidth: 16 } }
          },
          scales: {
            x: { ticks: { color: '#a8b5c8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } },
            y: { ticks: { color: '#a8b5c8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } }
          }
        }
      });

      const chartDivider = document.createElement('hr');
      chartDivider.className = 'stats-divider';
      statsPanel.appendChild(chartDivider);
    }

    if (hasCatData) {
      const mkCard = (label, bodyHtml) => {
        const card = document.createElement('div');
        card.className = 'stat-hl-card';
        card.innerHTML = `<div class="stat-hl-label">${label}</div><div class="stat-hl-body">${bodyHtml}</div>`;
        return card;
      };

      // Best category per team
      const starByTeam = teamNames.map((name, idx) => {
        const played = categories.filter(cat => categoryStats[cat] && categoryStats[cat][idx] !== undefined);
        if (!played.length) return null;
        const best = played.reduce((a, b) => (categoryStats[a][idx] || 0) >= (categoryStats[b][idx] || 0) ? a : b);
        return { short: name.replace('Equipo ', ''), color: teamColors[idx], cat: best, pts: categoryStats[best][idx] };
      }).filter(Boolean);

      // Category totals used to identify the easiest and hardest areas.
      const catTotals = {};
      categories.forEach(cat => {
        if (!categoryStats[cat]) return;
        catTotals[cat] = Object.values(categoryStats[cat]).reduce((a, b) => a + b, 0);
      });
      const catEntries = Object.entries(catTotals);
      const hardest = catEntries.length ? catEntries.reduce((a, b) => a[1] < b[1] ? a : b) : null;
      const hottest = catEntries.length ? catEntries.reduce((a, b) => a[1] > b[1] ? a : b) : null;

      // Team with the widest category performance range.
      const irregulars = teamNames.map((name, idx) => {
        const played = categories.filter(cat => categoryStats[cat] && categoryStats[cat][idx] !== undefined);
        if (played.length < 2) return null;
        const entries = played.map(cat => ({ cat, pts: categoryStats[cat][idx] }));
        const best  = entries.reduce((a, b) => a.pts >= b.pts ? a : b);
        const worst = entries.reduce((a, b) => a.pts <= b.pts ? a : b);
        return { name, short: name.replace('Equipo ', ''), color: teamColors[idx], range: best.pts - worst.pts, best, worst };
      }).filter(Boolean).sort((a, b) => b.range - a.range);
      const topRange = irregulars[0]?.range ?? null;
      const mostIrregulars = topRange !== null ? irregulars.filter(t => t.range === topRange) : [];

      // Highlight card grid
      const grid = document.createElement('div');
      grid.className = 'stats-highlights';

      const starHtml = starByTeam.map(t =>
        `<div class="stat-hl-team"><span class="stat-hl-dot" style="background:${t.color}"></span><span>${t.short}: <strong>${t.cat}</strong> (${t.pts > 0 ? '+' : ''}${t.pts})</span></div>`
      ).join('') || '<span class="text-muted">Sin datos</span>';
      grid.appendChild(mkCard('⭐ Mejor categoría por equipo', starHtml));

      grid.appendChild(mkCard('📈 Más irregular',
        mostIrregulars.length
          ? mostIrregulars.map(t =>
              `<div class="stat-hl-team"><span class="stat-hl-dot" style="background:${t.color}"></span>
               <span><strong>${t.name}</strong>
               <div class="stat-hl-sub">${t.best.cat} (${t.best.pts > 0 ? '+' : ''}${t.best.pts}) vs ${t.worst.cat} (${t.worst.pts > 0 ? '+' : ''}${t.worst.pts})</div>
               </span></div>`
            ).join('')
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('🔥 Más competida',
        hottest
          ? `<strong>${hottest[0]}</strong><div class="stat-hl-sub">${hottest[1] > 0 ? '+' : ''}${hottest[1]} pts totales</div>`
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('💀 Más difícil',
        hardest
          ? `<strong>${hardest[0]}</strong><div class="stat-hl-sub">${hardest[1] > 0 ? '+' : ''}${hardest[1]} pts totales</div>`
          : '<span class="text-muted">Sin datos</span>'
      ));

      statsPanel.appendChild(grid);

      const hr = document.createElement('hr');
      hr.className = 'stats-divider';
      statsPanel.appendChild(hr);

      const catTitle = document.createElement('div');
      catTitle.className = 'stats-title';
      catTitle.textContent = '📋 Por categoría';
      statsPanel.appendChild(catTitle);

      categories.filter(cat => categoryStats[cat]).forEach(cat => {
        const catData = categoryStats[cat];
        const entries = Object.entries(catData).map(([idx, pts]) => ({ idx: parseInt(idx), pts })).sort((a, b) => b.pts - a.pts);
        const maxPts = entries[0]?.pts;

        const catDiv = document.createElement('div');
        catDiv.className = 'stat-cat';
        const catName = document.createElement('div');
        catName.className = 'stat-cat-name';
        catName.textContent = cat;
        catDiv.appendChild(catName);

        const teamsRow = document.createElement('div');
        teamsRow.className = 'stat-teams-row';
        entries.forEach(({ idx, pts }) => {
          const chip = document.createElement('span');
          const isBest = pts === maxPts && pts > 0;
          chip.className = 'stat-team-chip' + (isBest ? ' stat-best' : '');
          chip.style.borderColor = teamColors[idx];
          chip.style.background = isBest ? teamColors[idx] : hexToRgba(teamColors[idx], 0.2);
          chip.style.color = isBest ? '#0f172a' : '#fff';
          chip.textContent = `${teamNames[idx].replace('Equipo ', '')}: ${pts > 0 ? '+' : ''}${pts}`;
          teamsRow.appendChild(chip);
        });

        catDiv.appendChild(teamsRow);
        statsPanel.appendChild(catDiv);
      });
    }
  }

  finalOverlay.style.display = 'flex';
  finalOverlay.setAttribute('aria-hidden', 'false');
  finalOverlay.classList.remove('final-overlay-open');
  requestAnimationFrame(() => finalOverlay.classList.add('final-overlay-open'));
  countUpWinnerScore(winner.score);
  setTimeout(() => { startConfetti(); }, 200);
  saveGameState();
}

function countUpWinnerScore(targetScore) {
  if (!winnerScoreEl) return;
  const duration = 900;
  const start = performance.now();
  const startValue = 0;
  const diff = targetScore - startValue;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(startValue + diff * eased);
    winnerScoreEl.innerText = `${value} Pts`;
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function closeFinalOverlay() {
  if (!finalOverlay) return;
  finalOverlay.classList.remove('final-overlay-open');
  finalOverlay.style.display = 'none';
  finalOverlay.setAttribute('aria-hidden','true');
  stopConfetti();
}

function resetBoardAndScores() {
  // Re-enable every board cell.
  const buttons = Array.from(document.querySelectorAll('.value'));
  buttons.forEach(b => {
    b.classList.remove('disabled');
    b.removeAttribute('aria-disabled');
    const parts = b.id.split('-');
    if (parts.length === 3) {
      const r = parseInt(parts[1], 10);
      const c = parseInt(parts[2], 10);
      b.onclick = () => {
        if (b.classList.contains('disabled')) return;
        openQuestion(r, c, b);
      };
    }
  });

  resetAllScores();
  applyTeamNeonBorders();
  closeFinalOverlay();

  document.querySelectorAll('.comodin').forEach(c => c.classList.remove('used'));
  revealedAudioCells.clear();
  Object.keys(assignedQuestions).forEach(key => delete assignedQuestions[key]);
  
  cellStates = {};
  audioPositions = {};
  usedQuestionsByPool = {};
  categoryStats = {};
  lastPlayedCategory = null;
  lastQuestionResolved = false;
  scoreHistory = [new Array(teamCount).fill(0)];
  if (finalChart) { finalChart.destroy(); finalChart = null; }
  clearGameProgress();

}

let confettiCtx = null;
let confettiParticles = [];
let confettiRAF = null;

function startConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');
  confettiParticles = [];
  const colors = ["#ff3b3b", "#00eaff", "#00ff88", "#ffd93b", "#ff00ff", "#ffffff"];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.5 + Math.random() * 1.5,
      size: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }
  function frame() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.x += Math.sin(p.y * 0.02) * 0.5;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot * Math.PI / 180);
      confettiCtx.shadowColor = p.color;
      confettiCtx.shadowBlur = 10;
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    confettiParticles.forEach(p => {
      if (p.y > confettiCanvas.height + 20) {
        p.x = Math.random() * confettiCanvas.width;
        p.y = -20;
      }
    });
    confettiRAF = requestAnimationFrame(frame);
  }
  if (!confettiRAF) frame();
  window.addEventListener('resize', onConfettiResize);
}

function stopConfetti() {
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  if (confettiCtx && confettiCanvas) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  window.removeEventListener('resize', onConfettiResize);
}

function onConfettiResize() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}

// Ruletas lives in js/ruletas.js. script.js keeps shared helpers and Family Trivia only.

document.addEventListener('DOMContentLoaded', () => {
  clearSavedGameOnReload();
  highlightActiveButton();
  buildBoard();
  applyGameMode();
  restoreGameState();
  initIndexPage();
  // Opening the panel needs the board and the cards already in place.
  startGamePanelFromNavigation();

  // Escape closes whatever is on top: ranking first, then the question overlay.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (finalOverlay?.style.display === 'flex') {
      closeFinalOverlay();
      return;
    }
    const questionOverlay = document.getElementById('overlay');
    if (questionOverlay?.style.display === 'flex') closeOverlay();
  });

  document.getElementById('soloNameInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startSoloGame();
  });
  document.getElementById('playersCountInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmPlayersCount(); }
  });
  document.getElementById('playerNamesList')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const inputs = [...document.querySelectorAll('#playerNamesList input')];
    const next = inputs[inputs.indexOf(e.target) + 1];
    if (next) next.focus();
    else confirmPlayerNames();
  });
  const rulesModal = document.getElementById('rulesModal');
  if (rulesModal) {
    rulesModal.addEventListener('click', (e) => {
      if (e.target === rulesModal) closeRulesModal();
    });
    rulesModal.querySelector('.btn-close')?.addEventListener('click', closeRulesModal);
  }
});


function toggleFinalStats() {
  const statsPanel = document.getElementById('statsPanel');
  const rankingList = document.getElementById('rankingList');
  const btn = document.getElementById('toggleStatsBtn');
  const showing = statsPanel && statsPanel.style.display === 'block';
  if (statsPanel) statsPanel.style.display = showing ? 'none' : 'block';
  if (rankingList) rankingList.style.display = showing ? 'block' : 'none';
  if (btn) btn.innerHTML = showing ? '📊 Ver estadísticas' : '🏆 Ver ranking';
  if (!showing && finalChart) setTimeout(() => finalChart.resize(), 50);
}

function toggleEditMode() {
  const scoreboard = document.getElementById('scoreboard');
  const btn = document.getElementById('editTeamsBtn');
  const active = scoreboard.classList.toggle('edit-mode');
  btn.classList.toggle('active', active);
}

function startRename(teamIndex) {
  const nameEl = document.getElementById(`team-name-${teamIndex}`);
  if (!nameEl) return;
  const original = nameEl.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = original;
  input.className = 'rename-input';
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const newName = input.value.trim() || original;
    const newEl = document.createElement('div');
    newEl.className = 'team-name';
    newEl.id = `team-name-${teamIndex}`;
    newEl.textContent = newName;
    // Teams 0-4 are coloured from CSS; extra players carry their colour inline.
    if (teamIndex >= 5) newEl.style.color = teamColorAt(teamIndex);
    input.replaceWith(newEl);
    teamNames[teamIndex] = newName;
    persistTeamName(teamIndex, newName);
    saveGameState();
  };

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') { input.value = original; input.blur(); }
  });
}

window.openQuestion = openQuestion;
window.resolveQuestion = resolveQuestion;
window.closeOverlay = closeOverlay;
window.adjustScore = adjustScore;
window.resetTeam = resetTeam;
window.resetAllScores = resetAllScores;
window.resetBoardAndScores = resetBoardAndScores;
window.showFinalRanking = showFinalRanking;
window.closeFinalOverlay = closeFinalOverlay;
window.toggleFinalStats = toggleFinalStats;
window.startRename = startRename;
window.toggleEditMode = toggleEditMode;
window.openRulesModal = openRulesModal;
window.closeRulesModal = closeRulesModal;
window.goToGamePanel = goToGamePanel;
window.goToTeamsSetup = goToTeamsSetup;
window.chooseSoloMode = chooseSoloMode;
window.chooseTeamsMode = chooseTeamsMode;
window.choosePlayersMode = choosePlayersMode;
window.confirmPlayersCount = confirmPlayersCount;
window.confirmPlayerNames = confirmPlayerNames;
window.skipPlayerNames = skipPlayerNames;
window.backToModeSelect = backToModeSelect;
window.startSoloGame = startSoloGame;
window.goToPortfolio = goToPortfolio;
