// ============================================================
// Family Trivia - Audio Player
// Play, pause, volume and progress bar for the questions that
// play a soundtrack. The game logic lives in script.js.
// ============================================================

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

// Drops the current track so the player does not keep the previous audio loaded.
function clearAudioSource() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.removeAttribute('src');
  audio.load();
}

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

// Hooks up the player buttons and the progress bar. Called once from script.js
// when the game page starts.
function initAudioPlayer() {
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
    // A missing or unplayable file would otherwise leave the presenter waiting.
    audio.addEventListener('error', () => {
      if (!audio.getAttribute('src')) return;
      setQuestionStatus('No se ha podido cargar el audio de esta pregunta. Puedes cambiarla con el boton de recargar.');
      playBtn.disabled = true;
      pauseBtn.disabled = true;
    });
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
}
