(function () {
  var bar = document.querySelector('.m-progress__bar');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollY() {
    return window.lenis ? window.lenis.scroll : window.scrollY;
  }

  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = max > 0 ? (scrollY() / max) * 100 + '%' : '0%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if (window.lenis) {
    window.lenis.on('scroll', updateProgress);
  }

  if (!reduced) {
    var revealEls = document.querySelectorAll('.m-reveal');
    if (revealEls.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.1 }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    document.querySelectorAll('.m-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (reduced) return;

  var statEls = document.querySelectorAll('[data-count]');
  if (!statEls.length) return;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    var duration = 900;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  var statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach(function (el) {
    statObserver.observe(el);
  });
})();
