(function () {
  if (typeof Lenis === 'undefined') return;

  var isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  var lenis = new Lenis({
    lerp: isApple ? 0.13 : 0.12,
    smoothWheel: true,
    wheelMultiplier: isApple ? 1.35 : 1.25,
    syncTouch: false
  });
  var bar = document.getElementById('progress');

  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }

  function raf(time) {
    lenis.raf(time);
    updateProgress();
    requestAnimationFrame(raf);
  }

  updateProgress();
  requestAnimationFrame(raf);
})();
