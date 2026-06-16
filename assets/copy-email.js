(function () {
  'use strict';

  var EMAIL = 'contact.hassan.amin@gmail.com';
  var RESET_MS = 2400;

  var checkSvg =
    '<svg class="copy-email-btn__check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  document.querySelectorAll('[data-copy-email]').forEach(function (btn) {
    var valueEl = btn.querySelector('.contact-link__value');
    var defaultLabel = btn.getAttribute('data-copy-label') || btn.textContent.trim();
    var copiedLabel = btn.getAttribute('data-copied-label') || 'copied';
    var defaultHtml = btn.innerHTML;
    var timer;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (btn.classList.contains('is-copied')) return;

      copyText(EMAIL)
        .then(function () {
          clearTimeout(timer);
          btn.classList.add('is-copied');

          if (valueEl) {
            // card button: swap text only, leave layout intact
            valueEl.textContent = 'copied \u2713';
          } else {
            // footer / inline text button
            btn.textContent = copiedLabel + ' \u2713';
          }

          timer = setTimeout(function () {
            btn.classList.remove('is-copied');
            if (valueEl) {
              valueEl.textContent = EMAIL;
            } else {
              btn.textContent = defaultLabel;
            }
          }, RESET_MS);
        })
        .catch(function () {
          window.location.href = 'mailto:' + EMAIL;
        });
    });
  });
})();
