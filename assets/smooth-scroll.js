(function () {
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.getScrollY = function () {
    return window.scrollY;
  };

  window.scrollToTarget = function (el, offset) {
    if (!el) return;
    offset = typeof offset === 'number' ? offset : 0;

    var top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  };

  window.initSmoothScroll = function (onFrame) {
    var onScrollFrame = typeof onFrame === 'function' ? onFrame : function () {};
    window.addEventListener('scroll', onScrollFrame, { passive: true });
    window.addEventListener('resize', onScrollFrame, { passive: true });
    onScrollFrame();
    return null;
  };

  if (!window.__smoothScrollCustom) {
    window.initSmoothScroll(function () {});
  }
})();
