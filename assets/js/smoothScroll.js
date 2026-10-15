import Lenis from './vendor/lenis.mjs';

export default function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // anchors: Lenis eases in-page links itself and still honours html's scroll-padding-top for the sticky header.
  new Lenis({ autoRaf: true, anchors: true });
}
