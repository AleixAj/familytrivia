// ============================================================
// Family Trivia - Animated Button Border
// Draws the moving dotted border around the main buttons with an
// svg on top of them. It is redrawn whenever a button changes size.
// ============================================================

const BORDER_COLORS = [
  { selector: '.btn-salas-primary',   color1: '#facc15', color2: '#f97316' },
  { selector: '.btn-intro-secondary', color1: '#38bdf8', color2: '#06b6d4' },
];

function setupAnimatedBorders() {
  BORDER_COLORS.forEach(({ selector, color1, color2 }) =>
    document.querySelectorAll(selector).forEach(btn => {
      if (btn.offsetWidth === 0) return;

      const existingSvg = btn.querySelector('svg');
      if (existingSvg) {
        const pad = 5;
        const expectedW = btn.offsetWidth + pad * 2;
        if (Math.abs(parseFloat(existingSvg.getAttribute('width')) - expectedW) < 1) return;
        existingSvg.remove();
      }

      buildAnimatedBorder(btn, color1, color2);

      if (typeof ResizeObserver !== 'undefined' && !btn._borderObserver) {
        btn._borderObserver = new ResizeObserver(() => {
          const svg = btn.querySelector('svg');
          if (!svg) return;
          const pad = 5;
          const expectedW = btn.offsetWidth + pad * 2;
          if (Math.abs(parseFloat(svg.getAttribute('width')) - expectedW) >= 1) {
            svg.remove();
            buildAnimatedBorder(btn, color1, color2);
          }
        });
        btn._borderObserver.observe(btn);
      }
    })
  );
}

function buildAnimatedBorder(btn, color1, color2) {
  const ns = 'http://www.w3.org/2000/svg';
  const pad = 5;
  const gap = 4;
  const numDots = 8;
  const dotLen = 40;
  const duration = 8000;

  const bW = btn.offsetWidth;
  const bH = btn.offsetHeight;
  const W = bW + pad * 2;
  const H = bH + pad * 2;
  const rx = bH / 2 + gap;
  const perim = 2 * (bW + 2 * gap - 2 * rx) + 2 * Math.PI * rx;
  const speed = perim / duration;

  const gradId = `btnGrad_${Math.random().toString(36).slice(2)}`;

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  Object.assign(svg.style, {
    position: 'absolute',
    top: `-${pad}px`,
    left: `-${pad}px`,
    pointerEvents: 'none',
    zIndex: '2',
    overflow: 'visible'
  });

  const defs = document.createElementNS(ns, 'defs');
  const grad = document.createElementNS(ns, 'linearGradient');
  grad.setAttribute('id', gradId);
  grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
  const s1 = document.createElementNS(ns, 'stop');
  s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', color1);
  const s2 = document.createElementNS(ns, 'stop');
  s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', color2);
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  const dots = [];
  for (let i = 0; i < numDots; i++) {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', pad - gap);
    r.setAttribute('y', pad - gap);
    r.setAttribute('width', bW + gap * 2);
    r.setAttribute('height', bH + gap * 2);
    r.setAttribute('rx', rx);
    r.setAttribute('fill', 'none');
    r.setAttribute('stroke', `url(#${gradId})`);
    r.setAttribute('stroke-width', '3');
    r.setAttribute('stroke-linecap', 'round');
    const initOffset = -(i * perim / numDots);
    r.setAttribute('stroke-dasharray', `${dotLen} ${perim - dotLen}`);
    r.setAttribute('stroke-dashoffset', initOffset);
    svg.appendChild(r);
    dots.push({ el: r, offset: initOffset });
  }

  btn.appendChild(svg);

  let last = null;
  // Stop as soon as this SVG is replaced, otherwise every rebuild would leave
  // an orphan animation loop running forever.
  (function animate(ts) {
    if (!btn.isConnected || !svg.isConnected) return;
    if (last !== null) {
      const dt = ts - last;
      for (const d of dots) {
        d.offset -= speed * dt;
        d.el.setAttribute('stroke-dashoffset', d.offset);
      }
    }
    last = ts;
    requestAnimationFrame(animate);
  })(performance.now());
}

// The buttons are measured to draw the border, so they must be visible first.
// Hidden containers (the game is behind d-none until the board opens) and
// responsive changes are picked up here.
document.addEventListener('DOMContentLoaded', () => {
  setupAnimatedBorders();

  // The board toggles classes constantly, so group the checks into one per frame
  // and skip the mutations that cannot change a button's size.
  let pendingCheck = null;
  const scheduleCheck = () => {
    if (pendingCheck !== null) return;
    pendingCheck = requestAnimationFrame(() => {
      pendingCheck = null;
      setupAnimatedBorders();
    });
  };

  new MutationObserver(mutations => {
    const relevant = mutations.some(m =>
      m.target instanceof Element && !m.target.closest('.board, .scoreboard, #overlay, #finalOverlay')
    );
    if (relevant) scheduleCheck();
  }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
});
