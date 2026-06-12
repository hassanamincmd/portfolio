/**
 * Mobile navigation — hamburger toggle.
 * Targets .mobile-nav (a <body> sibling of <header>,
 * outside the header's backdrop-filter stacking context).
 */
(function () {
  'use strict';

  var btn = document.querySelector('.header__menu-btn');
  var overlay = document.querySelector('.mobile-nav');
  var closeBtn = document.querySelector('.mobile-nav__close');
  if (!btn || !overlay) return;

  function openMenu() {
    overlay.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    overlay.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });
})();
