export default function initHeader() {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav || !toggle) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !nav.classList.contains('open')) return;
    setOpen(false);
    toggle.focus();
  });
}
