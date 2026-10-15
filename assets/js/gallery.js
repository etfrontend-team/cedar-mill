import GLightbox from './vendor/glightbox.mjs';

const GALLERIES_URL = '/assets/data/galleries.json';

// Custom shell replacing GLightbox's default markup: glyph buttons instead of its inline SVGs, our own caption line,
// and data-lenis-prevent so Lenis doesn't scroll the page behind the open gallery. The two ids are required by GLightbox.
const LIGHTBOX_HTML = `<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-modal="true" aria-label="Photo gallery" data-lenis-prevent>
  <div class="gloader visible"></div>
  <div class="goverlay"></div>
  <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <div class="gallery-caption" aria-live="polite"></div>
    <button type="button" class="gclose gbtn" aria-label="Close gallery" data-taborder="3">{closeSVG}</button>
    <button type="button" class="gprev gbtn" aria-label="Previous photo" data-taborder="2">{prevSVG}</button>
    <button type="button" class="gnext gbtn" aria-label="Next photo" data-taborder="1">{nextSVG}</button>
  </div>
</div>`;

export default function initGallery() {
  const triggers = document.querySelectorAll('[data-gallery]');
  if (!triggers.length) return;

  let galleries = null;
  const lightboxes = {};

  const createLightbox = (photos, trigger) => {
    const lightbox = GLightbox({
      elements: photos.map((photo) => ({ href: photo.src, type: 'image', alt: photo.caption })),
      lightboxHTML: LIGHTBOX_HTML,
      svg: { close: '×', prev: '‹', next: '›' },
      loop: true,
      openEffect: 'fade',
      closeEffect: 'fade',
      slideEffect: 'slide',
    });

    lightbox.on('slide_changed', ({ current }) => {
      const caption = document.querySelector('.glightbox-container .gallery-caption');
      if (!caption) return;
      const photo = photos[current.slideIndex];
      caption.textContent = `${photo.caption} · ${current.slideIndex + 1} / ${photos.length}`;
    });
    lightbox.on('close', () => trigger.focus());

    return lightbox;
  };

  const open = async (trigger) => {
    const key = trigger.dataset.gallery;
    try {
      // Fetched on first open only, so the page doesn't pay for gallery data nobody views.
      if (!galleries) {
        const res = await fetch(GALLERIES_URL);
        if (!res.ok) throw new Error('Could not load gallery');
        galleries = await res.json();
      }
      const photos = galleries[key] || [];
      if (!photos.length) return;
      lightboxes[key] ??= createLightbox(photos, trigger);
      lightboxes[key].open();
    } catch {
      if (trigger.nextElementSibling?.matches('[data-gallery-error]')) return;
      trigger.insertAdjacentHTML('afterend', '<div class="content content-muted media-note" data-gallery-error><p>The gallery could not load. Please refresh and try again.</p></div>');
    }
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', () => open(trigger)));
}
