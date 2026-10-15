import { Swiper, Navigation, Pagination, Autoplay, A11y } from './vendor/swiper.mjs';

const AUTOPLAY_DELAY = 11000;

export default function initSlider() {
  const sliders = document.querySelectorAll('[data-slider]');
  if (!sliders.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sliders.forEach((slider) => {
    const container = slider.querySelector('.swiper');
    const prev = slider.querySelector('[data-prev]');
    const next = slider.querySelector('[data-next]');
    const counter = slider.querySelector('[data-counter]');
    const pause = slider.querySelector('[data-pause]');
    if (!container || !prev || !next || !counter || !pause) return;

    const swiper = new Swiper(container, {
      modules: [Navigation, Pagination, Autoplay, A11y],
      loop: true,
      autoHeight: true,
      spaceBetween: 40,
      speed: reducedMotion ? 0 : 500,
      grabCursor: true,
      navigation: { prevEl: prev, nextEl: next },
      pagination: { el: counter, type: 'fraction' },
      autoplay: { delay: AUTOPLAY_DELAY, disableOnInteraction: false },
      a11y: { prevSlideMessage: 'Previous testimonial', nextSlideMessage: 'Next testimonial' },
    });

    // Google Fonts swap in after init; re-measure so autoHeight fits the final quote height.
    document.fonts.ready.then(() => swiper.updateAutoHeight(0));

    let paused = reducedMotion;

    const updatePause = () => {
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? 'Play automatic testimonials' : 'Pause automatic testimonials');
    };

    pause.addEventListener('click', () => {
      paused = !paused;
      if (paused) swiper.autoplay.stop();
      else swiper.autoplay.start();
      updatePause();
    });

    if (paused) swiper.autoplay.stop();
    updatePause();
  });
}
