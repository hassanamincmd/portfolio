(function () {
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;

  document.documentElement.classList.add('has-site-cursor');

  var cursor = document.createElement('div');
  cursor.className = 'site-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  var eye = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  eye.setAttribute('class', 'site-cursor__eye');
  eye.setAttribute('width', '18');
  eye.setAttribute('height', '18');
  eye.setAttribute('viewBox', '0 0 24 24');
  eye.setAttribute('fill', 'none');
  eye.setAttribute('stroke', 'currentColor');
  eye.setAttribute('stroke-width', '2');
  eye.setAttribute('stroke-linecap', 'round');
  eye.setAttribute('stroke-linejoin', 'round');
  eye.setAttribute('aria-hidden', 'true');

  var eyePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eyePath.setAttribute('d', 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z');
  eye.appendChild(eyePath);

  var eyePupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  eyePupil.setAttribute('cx', '12');
  eyePupil.setAttribute('cy', '12');
  eyePupil.setAttribute('r', '3');
  eye.appendChild(eyePupil);

  var label = document.createElement('span');
  label.className = 'site-cursor__label';
  label.textContent = 'Case Study';

  cursor.appendChild(eye);
  cursor.appendChild(label);
  document.body.appendChild(cursor);

  var initCursor = false;
  var x = 0;
  var y = 0;
  var mode = '';

  function refreshHit() {
    var el = document.elementFromPoint(x, y);
    if (!el) {
      mode = '';
      return;
    }

    var viewHit = el.closest('[data-ui-highlight], .ui-highlight-card');
    var readHit = el.closest('[data-case-card], [data-cursor="read-more"]');

    if (viewHit) mode = 'view';
    else if (readHit) mode = 'read-more';
    else mode = '';
  }

  function renderCursor() {
    if (!initCursor) return;

    refreshHit();
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    cursor.classList.toggle('is-read-more', mode === 'read-more');
    cursor.classList.toggle('is-view', mode === 'view');
  }

  function onMove(e) {
    x = e.clientX;
    y = e.clientY;

    if (!initCursor) {
      cursor.classList.add('is-on');
      initCursor = true;
    }
  }

  function onLeave() {
    cursor.classList.remove('is-on');
    cursor.classList.remove('is-read-more');
    cursor.classList.remove('is-view');
    initCursor = false;
    mode = '';
  }

  function loop() {
    renderCursor();
    requestAnimationFrame(loop);
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

  requestAnimationFrame(loop);
})();
