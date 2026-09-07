(function () {
  var bar = document.querySelector('#progress');
  var scrollTimer = 0;

  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0%';
  }

  function onScroll() {
    document.documentElement.classList.add('is-scrolling');
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      document.documentElement.classList.remove('is-scrolling');
    }, 140);
    updateProgress();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
})();
