(function () {
  var bar = document.querySelector('.cs-progress__bar');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if (reduced) return;

  var revealEls = document.querySelectorAll('.cs-reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
