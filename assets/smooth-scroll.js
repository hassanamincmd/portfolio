(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.Lenis || window.lenis) return;

  var isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  var lenis = new Lenis({
    lerp: isApple ? 0.13 : 0.11,
    smoothWheel: true,
    wheelMultiplier: isApple ? 1.3 : 1.2,
    syncTouch: false
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
})();
