// Banner carousel: swipe / mouse drag, dots, autoplay

export function initCarousel(carousel, dots) {
  const slides = carousel.querySelectorAll('.banner');
  let slideIndex = 0;
  let autoplay;

  dots.innerHTML = [...slides].map((_, i) =>
    `<button class="dot" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-slide]');
    if (dot) goToSlide(Number(dot.dataset.slide));
  });

  function slideStep() { return slides[1].offsetLeft - slides[0].offsetLeft; }

  function goToSlide(i) {
    carousel.scrollTo({ left: i * slideStep(), behavior: 'smooth' });
    restartAutoplay();
  }

  function syncDots() {
    slideIndex = Math.round(carousel.scrollLeft / slideStep());
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === slideIndex));
  }

  function restartAutoplay() {
    clearInterval(autoplay);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplay = setInterval(() => {
      carousel.scrollTo({ left: ((slideIndex + 1) % slides.length) * slideStep(), behavior: 'smooth' });
    }, 5000);
  }

  // Mouse drag (desktop / Telegram Desktop); touch devices already swipe natively
  let drag = null;
  let suppressClick = false;
  carousel.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, left: carousel.scrollLeft, moved: false };
    carousel.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) drag.moved = true;
    carousel.scrollLeft = drag.left - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved;
    carousel.classList.remove('dragging');
    drag = null;
    if (moved) {
      goToSlide(Math.round(carousel.scrollLeft / slideStep()));
      // swallow the click that follows a drag so a CTA isn't triggered
      suppressClick = true;
      setTimeout(() => { suppressClick = false; });
    }
  });
  carousel.addEventListener('click', (e) => { if (suppressClick) e.stopPropagation(); }, { capture: true });
  carousel.addEventListener('dragstart', (e) => e.preventDefault());

  carousel.addEventListener('scroll', syncDots, { passive: true });
  carousel.addEventListener('pointerdown', restartAutoplay);
  carousel.addEventListener('touchstart', restartAutoplay, { passive: true });
  syncDots();
  restartAutoplay();
}
