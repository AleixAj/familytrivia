// ============================================================
// Family Trivia - Shared Footer
// Adds the same footer to every page, so the markup does not
// have to be copied into each html file.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.createElement('footer');
  footer.className = 'page-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <span class="footer-copy">Family Trivia © 2026</span>
      <span class="footer-sep">·</span>
      <a class="footer-link" href="https://aleixaj.com/" target="_blank" rel="noopener">
        <span class="footer-logo" aria-hidden="true"></span>
        <span>Aleix Auqué</span>
      </a>
    </div>
  `;
  document.body.appendChild(footer);
});
