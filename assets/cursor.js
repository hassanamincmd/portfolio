(function () {
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;

  document.documentElement.classList.add('has-site-cursor');

  var cursor = document.createElement('div');
  cursor.className = 'site-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  var label = document.createElement('span');
  label.className = 'site-cursor__label';
  label.textContent = 'Read More';
  cursor.appendChild(label);
  document.body.appendChild(cursor);

  var initCursor = false;
  var rafId = 0;
  var x = 0;
  var y = 0;
  var readMore = false;

  function apply() {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    cursor.classList.toggle('is-read-more', readMore);
    rafId = 0;
  }

  function queue() {
    if (!rafId) rafId = requestAnimationFrame(apply);
  }

  function onMove(e) {
    x = e.clientX;
    y = e.clientY;

    if (!initCursor) {
      cursor.classList.add('is-on');
      initCursor = true;
    }

    var hit =
      e.target &&
      e.target.closest &&
      e.target.closest('[data-case-card], [data-cursor="read-more"]');
    readMore = !!hit;
    queue();
  }

  function onLeave() {
    cursor.classList.remove('is-on');
    cursor.classList.remove('is-read-more');
    initCursor = false;
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && !e.toElement) onLeave();
  });

  fine.addEventListener('change', function () {
    if (!fine.matches) {
      document.documentElement.classList.remove('has-site-cursor');
      cursor.remove();
    }
  });
})();
