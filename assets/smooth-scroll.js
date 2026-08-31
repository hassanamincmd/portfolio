(function () {
  function isAppleDevice() {
    return (
      /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.getScrollY = function () {
    return window.lenis ? window.lenis.scroll : window.scrollY;
  };

  window.scrollToTarget = function (el, offset) {
    if (!el) return;
    offset = typeof offset === 'number' ? offset : 0;

    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: offset });
      return;
    }

    var top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  };

  window.initSmoothScroll = function (onFrame) {
    var onScrollFrame = typeof onFrame === 'function' ? onFrame : function () {};

    function bindNativeScroll() {
      window.addEventListener('scroll', onScrollFrame, { passive: true });
      window.addEventListener('resize', onScrollFrame, { passive: true });
      onScrollFrame();
    }

    /* Lenis smooth-wheel fights macOS trackpad inertia — use native scroll there. */
    if (prefersReducedMotion() || isAppleDevice()) {
      bindNativeScroll();
      return null;
    }

    if (!window.Lenis) {
      bindNativeScroll();
      return null;
    }

    if (window.lenis) {
      return window.lenis;
    }

    var lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.25,
      syncTouch: false
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      onScrollFrame();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.addEventListener('resize', onScrollFrame, { passive: true });
    return lenis;
  };

  if (!window.__smoothScrollCustom) {
    window.initSmoothScroll(function () {});
  }
})();
