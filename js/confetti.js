// ============================================================
// Family Trivia - Confetti
// Falling paper rectangles drawn on a canvas over the final
// ranking. Nothing else in the game depends on this file.
// ============================================================

const confettiCanvas = document.getElementById('confettiCanvas');

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
