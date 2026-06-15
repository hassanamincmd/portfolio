(function () {
  'use strict';

  var PDF_PATH = '/assets/Hassan-Amin-CV-Resume.pdf';
  var DOCX_PATH = '/assets/Hassan-Amin-CV-Resume.docx';
  var PDF_NAME = 'Hassan-Amin-CV-Resume.pdf';
  var DOCX_NAME = 'Hassan-Amin-CV-Resume.docx';

  var modal;
  var iframe;
  var lastFocus;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'resume-modal';
    modal.id = 'resume-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'resume-modal-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="resume-modal__backdrop" data-resume-close></div>' +
      '<div class="resume-modal__panel">' +
        '<div class="resume-modal__header">' +
          '<div>' +
            '<span class="resume-modal__eyebrow">.resume / cv</span>' +
            '<h2 class="resume-modal__title" id="resume-modal-title">Hassan Amin</h2>' +
          '</div>' +
          '<button type="button" class="resume-modal__close" data-resume-close aria-label="Close resume preview">' +
            '<span></span><span></span>' +
          '</button>' +
        '</div>' +
        '<div class="resume-modal__actions">' +
          '<a class="resume-modal__btn resume-modal__btn--primary" href="' + PDF_PATH + '" download="' + PDF_NAME + '">download pdf</a>' +
          '<a class="resume-modal__btn" href="' + DOCX_PATH + '" download="' + DOCX_NAME + '">download docx</a>' +
          '<a class="resume-modal__btn resume-modal__btn--ghost" href="' + PDF_PATH + '" target="_blank" rel="noreferrer">open in new tab</a>' +
        '</div>' +
        '<div class="resume-modal__viewer">' +
          '<iframe class="resume-modal__iframe" title="Resume PDF preview" src="about:blank"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    iframe = modal.querySelector('.resume-modal__iframe');

    modal.querySelectorAll('[data-resume-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
  }

  function openModal() {
    if (!modal) buildModal();
    lastFocus = document.activeElement;
    iframe.src = PDF_PATH + '#toolbar=1&navpanes=0&view=FitH';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('resume-modal-open');
    modal.querySelector('.resume-modal__close').focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('resume-modal-open');
    iframe.src = 'about:blank';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-resume-modal]');
    if (!trigger) return;
    e.preventDefault();
    openModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      e.stopImmediatePropagation();
      closeModal();
    }
  });
})();
