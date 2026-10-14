/* BB Collection — lightweight 3D interactions. No framework or WebGL required. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.documentElement.classList.add('bb-experience');

  const hero = document.querySelector('.hero-art');
  if (hero) {
    hero.setAttribute('aria-label', 'Interactive BB Collection product showcase');
    hero.classList.add('bb-hero-stage');
    const shirt = hero.querySelector('.hero-shirt');
    if (shirt) {
      shirt.loading = 'eager';
      shirt.decoding = 'async';
      shirt.draggable = false;
    }
    if (finePointer && !reduceMotion) {
      let frame = 0;
      hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          hero.style.setProperty('--tilt-x', ((.5 - y) * 7).toFixed(2) + 'deg');
          hero.style.setProperty('--tilt-y', ((x - .5) * 9).toFixed(2) + 'deg');
          hero.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
          hero.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
        });
      }, { passive: true });
      hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--tilt-x', '0deg');
        hero.style.setProperty('--tilt-y', '0deg');
        hero.style.setProperty('--glow-x', '50%');
        hero.style.setProperty('--glow-y', '45%');
      }, { passive: true });
    }
  }

  const revealTargets = document.querySelectorAll(
    '.section-head, .category, .product-card, .ig-panel, .story, .newsletter'
  );
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('bb-in-view');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealTargets.forEach((el, index) => {
      el.classList.add('bb-reveal');
      if (el.classList.contains('product-card')) {
        el.style.setProperty('--reveal-delay', (index % 4) * 55 + 'ms');
      }
      observer.observe(el);
    });
  }

  if (finePointer && !reduceMotion) {
    document.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.product-card');
      if (!card || !card.contains(event.target)) return;
      const surface = card.querySelector('.product-image');
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      surface.style.setProperty('--card-rotate-x', ((.5 - y) * 5).toFixed(2) + 'deg');
      surface.style.setProperty('--card-rotate-y', ((x - .5) * 6).toFixed(2) + 'deg');
      surface.style.setProperty('--card-glow-x', (x * 100).toFixed(1) + '%');
      surface.style.setProperty('--card-glow-y', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    document.addEventListener('pointerout', (event) => {
      const card = event.target.closest('.product-card');
      if (!card || card.contains(event.relatedTarget)) return;
      const surface = card.querySelector('.product-image');
      if (!surface) return;
      surface.style.setProperty('--card-rotate-x', '0deg');
      surface.style.setProperty('--card-rotate-y', '0deg');
      surface.style.setProperty('--card-glow-x', '50%');
      surface.style.setProperty('--card-glow-y', '50%');
    }, { passive: true });
  }
})();
