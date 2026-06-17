(function () {
  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
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
