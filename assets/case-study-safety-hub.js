(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var els = document.querySelectorAll('.sh-contrib__card, .sh-finding, .sh-card');
  els.forEach(function (el, i) {
    el.classList.add('sh-reveal');
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.transitionDelay = String((i % 4) * 60) + 'ms';
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  els.forEach(function (el) {
    observer.observe(el);
  });
})();
