(function () {
  var root = document.querySelector('[data-about-carousel]');
  if (!root) return;

  var track = root.querySelector('.about-carousel__track');
  var slides = Array.from(root.querySelectorAll('.about-carousel__slide'));
  var dots = Array.from(root.querySelectorAll('.about-carousel__dot'));
  if (!track || !slides.length) return;

  var index = 0;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touchStartX = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    slides.forEach(function (slide, n) {
      slide.classList.toggle('is-active', n === index);
    });
    dots.forEach(function (dot, n) {
      var active = n === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
    });
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    }
  });

  root.addEventListener(
    'touchstart',
    function (e) {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  root.addEventListener(
    'touchend',
    function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 40) return;
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );

  if (!reduced) {
    track.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  goTo(0);
})();
