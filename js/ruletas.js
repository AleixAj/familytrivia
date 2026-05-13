'use strict';

function initRuletasPage() {
  const hasCanvasA = document.getElementById('canvasA');
  const hasCanvasB = document.getElementById('canvasB');
  if (!hasCanvasA && !hasCanvasB) return;

  function Wheel(canvasId, listId, winnerDisplayId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.listEl = document.getElementById(listId);
    this.winnerDisplayEl = document.getElementById(winnerDisplayId);
    this.names = [];
    this.colors = [];
    this.rotation = 0;
    this.animationId = null;
    this.size = Math.min(this.canvas.width, this.canvas.height) * 0.95;  // Slightly smaller for better fit on tablets
    this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.radius = Math.min(this.size / 2 - 8, 160);  // Cap radius, reduce margin for tablets
    this.font = 'bold 14px Poppins, sans-serif';
    this.isSpinning = false;
    this.init();
  }

  Wheel.prototype.updateDimensions = function() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;
    
    // Physical canvas dimensions
    this.canvas.width = Math.round(logicalW * dpr);
    this.canvas.height = Math.round(logicalH * dpr);
    this.canvas.style.width = logicalW + 'px';
    this.canvas.style.height = logicalH + 'px';
    
    // Physical center for drawing
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    
    // Logical dimensions for size calc
    this.logicalW = logicalW;
    this.logicalH = logicalH;
    
    // Update size/radius based on logical dimensions
    this.size = Math.min(logicalW, logicalH) * 0.92;
    this.radius = Math.min(this.size / 2 - 12, 150);
  };

  Wheel.prototype.init = function() {
    this.updateDimensions();
    this.generateColors();
    this.draw();
  };

  Wheel.prototype.addName = function(name) {
    if (!name) return;
    this.names.push(name);
    this.generateColors();
    this.renderList();
    this.updateDimensions();
    this.draw();
  };

  Wheel.prototype.removeNameAt = function(index) {
    if (index < 0 || index >= this.names.length) return;
    this.names.splice(index, 1);
    this.generateColors();
    this.renderList();
    this.draw();
  };

  Wheel.prototype.clear = function() {
    this.names = [];
    this.generateColors();
    this.renderList();
    this.draw();
    if (this.winnerDisplayEl) this.winnerDisplayEl.innerText = 'â€”';
  };

  Wheel.prototype.generateColors = function() {
    this.colors = this.names.map((_, i) => {
      const hue = (i * 47) % 360;
      return `hsl(${hue} 85% 55%)`;
    });
  };

  Wheel.prototype.renderList = function() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    this.names.forEach((n, i) => {
      const div = document.createElement('div');
      div.innerHTML = `<span>${i+1}. ${escapeHtml(n)}</span>`;
      const btn = document.createElement('button');
      btn.textContent = 'X';
      btn.title = 'Eliminar';
      btn.onclick = () => { this.removeNameAt(i); };
      div.appendChild(btn);
      this.listEl.appendChild(div);
    });
  };

  Wheel.prototype.draw = function() {
    if (!this.ctx) return;
    
    // Always recalc dimensions before draw
    this.updateDimensions();
    
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    const logicalW = this.logicalW;
    const logicalH = this.logicalH;
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    
    // Use logical center (pre-calculated physical / dpr)
    const logicalCenterX = this.centerX / dpr;
    const logicalCenterY = this.centerY / dpr;
    ctx.translate(logicalCenterX, logicalCenterY);
    ctx.rotate(this.rotation);
    ctx.translate(-logicalCenterX, -logicalCenterY);
    const n = Math.max(1, this.names.length);
    const anglePer = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const start = i * anglePer;
      const end = start + anglePer;
      ctx.beginPath();
      ctx.moveTo(logicalW/2, logicalH/2);
      ctx.arc(logicalW/2, logicalH/2, this.radius, start, end);
      ctx.closePath();
      ctx.fillStyle = this.colors[i] || '#2b2f3a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      const mid = start + anglePer / 2;
      ctx.save();
      ctx.translate(logicalW/2, logicalH/2);
      ctx.rotate(mid);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = this.font;
      const text = this.names[i] || 'â€”';
      const maxWidth = this.radius * 0.7;
      drawWrappedText(ctx, text, this.radius - 12, maxWidth, 14);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(logicalW/2, logicalH/2, this.radius * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();
    ctx.restore();
  };

  function drawWrappedText(ctx, text, radiusPos, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const test = line ? (line + ' ' + words[i]) : words[i];
      const metrics = ctx.measureText(test);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const totalHeight = lines.length * lineHeight;
    const startY = - (totalHeight / 2) + (lineHeight / 2);
    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], radiusPos, startY + j * lineHeight);
    }
  }

  Wheel.prototype.spinToRandom = function(onComplete) {
    if (this.isSpinning || this.names.length === 0) return;
    this.isSpinning = true;
    const n = this.names.length;
    const anglePer = (Math.PI * 2) / n;
    const targetIndex = Math.floor(Math.random() * n);
    const targetMid = (targetIndex + 0.5) * anglePer;
    const baseRotations = 6;
    const extra = Math.max(0, Math.ceil((6 - n) * 1.2));
    const randomExtra = Math.floor(Math.random() * 4);
    const rotations = baseRotations + extra + randomExtra;
    const desiredRotation = (-Math.PI/2 - targetMid) + rotations * Math.PI * 2;
    const startRotation = this.rotation;
    let diff = desiredRotation - startRotation;
    if (diff < 0) diff += Math.PI * 2 * Math.ceil(Math.abs(diff) / (Math.PI * 2));
    const duration = Math.max(4000, 2500 + rotations * 400 + Math.random() * 800);
    const startTime = performance.now();
    const self = this;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      self.rotation = startRotation + diff * eased;
      self.draw();
      if (t < 1) {
        self.animationId = requestAnimationFrame(frame);
      } else {
        self.rotation = (startRotation + diff) % (Math.PI * 2);
        self.draw();
        self.isSpinning = false;
        const normalized = ((-Math.PI/2 - self.rotation) % (Math.PI*2) + (Math.PI*2)) % (Math.PI*2);
        const winnerIndex = Math.floor(normalized / anglePer) % n;
        const winner = self.names[winnerIndex];
        if (self.winnerDisplayEl) self.winnerDisplayEl.innerText = winner || 'â€”';
        if (typeof onComplete === 'function') onComplete(winnerIndex, winner);
      }
    }
    this.animationId = requestAnimationFrame(frame);
  };

  Wheel.prototype.stopAnimation = function() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.isSpinning = false;
  };

  const wheelA = new Wheel('canvasA','listA','winnerDisplayA');
  const wheelB = new Wheel('canvasB','listB','winnerDisplayB');

  const addA = document.getElementById('addA');
  const inputA = document.getElementById('inputA');
  const spinA = document.getElementById('spinA');
  const clearA = document.getElementById('clearA');
  const addB = document.getElementById('addB');
  const inputB = document.getElementById('inputB');
  const spinB = document.getElementById('spinB');
  const clearB = document.getElementById('clearB');

  if (addA && inputA) {
    addA.addEventListener('click', () => {
      const v = inputA.value.trim();
      if (!v) return;
      wheelA.addName(v);
      inputA.value = '';
    });
  }
  if (spinA) {
    spinA.addEventListener('click', () => {
      if (wheelA.names.length === 0) { showToast('AÃ±ade al menos un nombre a la Ruleta 1'); return; }
      spinA.disabled = true;
      wheelA.spinToRandom(() => { spinA.disabled = false; });
    });
  }
  if (clearA) clearA.addEventListener('click', () => { wheelA.clear(); });

  if (addB && inputB) {
    addB.addEventListener('click', () => {
      const v = inputB.value.trim();
      if (!v) return;
      wheelB.addName(v);
      inputB.value = '';
    });
  }
  if (spinB) {
    spinB.addEventListener('click', () => {
      if (wheelB.names.length === 0) { showToast('AÃ±ade al menos un nombre a la Ruleta 2'); return; }
      spinB.disabled = true;
      wheelB.spinToRandom(() => { spinB.disabled = false; });
    });
  }
  if (clearB) clearB.addEventListener('click', () => { wheelB.clear(); });

  if (inputA) {
    inputA.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addA && addA.click(); } });
  }
  if (inputB) {
    inputB.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addB && addB.click(); } });
  }

  function resizeAllCanvases() {
    ['canvasA','canvasB'].forEach(id => {
      const c = document.getElementById(id);
      if (!c) return;
      const parent = c.parentElement;
      const available = Math.min(parent.clientWidth - 16, parent.clientWidth * 0.9);
      c.style.width = available + 'px';
      c.style.height = available + 'px';
    });
    
    // Update wheel dimensions (calls updateDimensions + draw internally)
    [wheelA, wheelB].forEach(w => {
      if (!w || !w.canvas) return;
      w.draw();  // This now handles updateDimensions()
    });
  }

  window.addEventListener('load', () => {
    resizeAllCanvases();
    highlightActiveButton();
    resizeAllCanvases();
  });
  window.addEventListener('resize', () => { resizeAllCanvases(); });

  // ==================== SPIN BOTH WHEELS ====================
  const spinBothBtn = document.getElementById('spinBothBtn');
  const teamsListEl = document.getElementById('teamsList');
  const clearTeamsBtn = document.getElementById('clearTeamsBtn');
  // sessionStorage persists across navigations but clears on page refresh
  const _navType = (performance.getEntriesByType?.('navigation')?.[0]?.type)
    ?? (performance.navigation?.type === 1 ? 'reload' : 'navigate');
  if (_navType === 'reload') sessionStorage.removeItem('ruletaTeams');

  let teams = JSON.parse(sessionStorage.getItem('ruletaTeams') || '[]');

  function syncTeams() { sessionStorage.setItem('ruletaTeams', JSON.stringify(teams)); }

  const TEAM_COLORS      = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7'];
  const TEAM_COLOR_NAMES = ['rojo',    'azul',    'verde',   'amarillo', 'morado'];

  function teamColor(teamNumber) {
    return teamNumber <= TEAM_COLORS.length ? TEAM_COLORS[teamNumber - 1] : '#6b7280';
  }
  function teamColorName(teamNumber) {
    return teamNumber <= TEAM_COLOR_NAMES.length ? TEAM_COLOR_NAMES[teamNumber - 1] : 'neutro';
  }

  function renderTeams() {
    if (!teamsListEl) return;
    teamsListEl.innerHTML = '';
    teams.forEach((team, i) => {
      const teamNum = i + 1;
      const color = teamColor(teamNum);
      const colorName = teamColorName(teamNum);
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:4px 0';
      div.innerHTML = `
        <span style="background:${color};color:${teamNum === 4 ? '#000' : '#fff'};font-weight:700;padding:2px 10px;border-radius:99px;font-size:13px;white-space:nowrap;text-transform:capitalize;">Equipo ${colorName}</span>
        <span style="font-weight:700;flex:1">${escapeHtml(team)}</span>
        <button style="background:#ef4444;color:white;padding:4px 10px;border:none;border-radius:6px;cursor:pointer;font-size:13px;">Eliminar</button>
      `;
      div.querySelector('button').onclick = () => {
        teams.splice(i, 1);
        renderTeams();
      };
      teamsListEl.appendChild(div);
    });
  }

  function autoPairLastRemaining() {
    if (wheelA.names.length === 1 && wheelB.names.length === 1) {
      const lastA = wheelA.names[0];
      const lastB = wheelB.names[0];
      const finalTeam = `${lastA} + ${lastB}`;
      teams.push(finalTeam);
      syncTeams();
      renderTeams();
      showTeamPopup(teams.length, lastA, lastB);
      saveRuletaTeam(teams.length, lastA, lastB);

      // Limpiamos las ruletas completamente
      wheelA.clear();
      wheelB.clear();
      return true;
    }
    return false;
  }

  function saveRuletaTeam(teamNumber, nameA, nameB) {
    if (teamNumber > 5) return;
    const saved = JSON.parse(localStorage.getItem('ruletaTeamNames') || '{}');
    saved[teamNumber - 1] = `${nameA} y ${nameB}`;
    localStorage.setItem('ruletaTeamNames', JSON.stringify(saved));
  }

  let _teamPopupTimer = null;
  let _teamPopupHideTimer = null;
  function showTeamPopup(teamNumber, nameA, nameB) {
    const popup = document.getElementById('teamPopup');
    const label = document.getElementById('teamPopupLabel');
    const names = document.getElementById('teamPopupNames');
    if (!popup || !label || !names) return;

    const color = teamColor(teamNumber);
    const textCol = (teamNumber === 4 && teamNumber <= 5) ? '#000' : '#fff';
    const card = popup.querySelector('.team-popup-card');
    if (card) {
      card.style.borderColor = color;
      card.style.boxShadow = `0 0 60px ${color}55, 0 20px 60px rgba(0,0,0,0.8)`;
    }
    label.style.background = color;
    label.style.color = textCol;
    label.style.borderRadius = '99px';
    label.style.padding = '4px 18px';
    label.style.display = 'inline-block';
    label.textContent = `Equipo ${teamColorName(teamNumber)}`;
    names.innerHTML = `${escapeHtml(nameA)} &amp; ${escapeHtml(nameB)}`;

    clearTimeout(_teamPopupTimer);
    clearTimeout(_teamPopupHideTimer);

    popup.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => popup.classList.add('visible')));

    _teamPopupTimer = setTimeout(() => {
      popup.classList.remove('visible');
      _teamPopupHideTimer = setTimeout(() => { popup.style.display = 'none'; }, 370);
    }, 3200);
  }

  function spinBothWheels() {
    if (wheelA.isSpinning || wheelB.isSpinning) return;

    // Caso especial: ya solo queda 1 nombre en cada ruleta â†’ emparejar directamente
    if (autoPairLastRemaining()) return;

    // Caso normal: al menos 1 nombre en cada ruleta
    if (wheelA.names.length === 0 || wheelB.names.length === 0) {
      showToast('Ambas ruletas deben tener al menos un nombre.');
      return;
    }

    spinBothBtn.disabled = true;
    const spinBothLabel = document.getElementById('spinBothLabel');
    if (spinBothLabel) spinBothLabel.textContent = 'Girando...';

    let winnerA = null;
    let winnerB = null;

    wheelA.spinToRandom((index, name) => {
      winnerA = name;
      checkBothDone();
    });

    wheelB.spinToRandom((index, name) => {
      winnerB = name;
      checkBothDone();
    });

    function checkBothDone() {
      if (winnerA !== null && winnerB !== null) {
        const teamName = `${winnerA} + ${winnerB}`;
        teams.push(teamName);
        syncTeams();
        renderTeams();
        showTeamPopup(teams.length, winnerA, winnerB);
        saveRuletaTeam(teams.length, winnerA, winnerB);

        // Eliminar los ganadores de sus ruletas
        const idxA = wheelA.names.indexOf(winnerA);
        const idxB = wheelB.names.indexOf(winnerB);
        if (idxA !== -1) wheelA.removeNameAt(idxA);
        if (idxB !== -1) wheelB.removeNameAt(idxB);

        // Comprobar si ahora quedan los Ãºltimos 2 (1 en cada ruleta)
        if (wheelA.names.length === 1 && wheelB.names.length === 1) {
          setTimeout(() => {
            autoPairLastRemaining();
            spinBothBtn.disabled = false;
            if (spinBothLabel) spinBothLabel.textContent = 'Girar las dos ruletas a la vez';
          }, 3400);
        } else {
          spinBothBtn.disabled = false;
          spinBothBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i>Girar las dos ruletas a la vez';
        }
      }
    }
  }

  if (spinBothBtn) {
    spinBothBtn.addEventListener('click', spinBothWheels);
  }

  if (clearTeamsBtn) {
    clearTeamsBtn.addEventListener('click', () => {
      if (confirm('Â¿Quieres eliminar todos los equipos formados?')) {
        teams = [];
        syncTeams();
        renderTeams();
        localStorage.removeItem('ruletaTeamNames');
      }
    });
  }

  renderTeams();
}

window.addEventListener('load', () => {
  initRuletasPage();
});
