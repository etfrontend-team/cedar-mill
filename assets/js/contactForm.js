const INQUIRIES = ['project', 'service', 'showroom', 'general']

export default function initContactForm() {
  const form = document.querySelector('#contact-form')
  if (!form) return

  const tabs = document.querySelectorAll('[data-inquiry]')
  const inquiryInput = form.querySelector('[name="inquiry"]')
  const showroomFields = form.querySelector('.showroom-fields')
  const status = form.querySelector('.form-status')

  const setInquiry = (value) => {
    const inquiry = INQUIRIES.includes(value) ? value : 'project'
    inquiryInput.value = inquiry
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(tab.dataset.inquiry === inquiry)))
    showroomFields.hidden = inquiry !== 'showroom'
    status.replaceChildren()
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => setInquiry(tab.dataset.inquiry)))
  setInquiry(new URLSearchParams(window.location.search).get('inquiry'))

  // No backend is connected yet, so submitting shows the reference's preview confirmation instead of sending.
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message =
      inquiryInput.value === 'showroom'
        ? 'Thank you for reaching out to Cedar Mill Co. We’ve received your showroom visit request and will be in touch to confirm the appointment.'
        : 'Thank you for reaching out to Cedar Mill Co. We’ve received your message and will be in touch soon.'
    status.innerHTML = `<div class="form-success"><strong>Preview of the confirmation message</strong><div class="content content-ink"><p>${message}</p></div><div class="content content-muted content-13 draft-note"><p>This is a preview. No message has been sent.</p></div></div>`
  })
}
