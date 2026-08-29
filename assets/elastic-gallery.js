(function () {
  var gallery = document.querySelector("[data-elastic-gallery]");
  if (!gallery) return;

  var panels = Array.from(gallery.querySelectorAll(".elastic-gallery__panel"));
  if (!panels.length) return;

  var isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var defaultIndex = Math.min(1, panels.length - 1);

  function setActive(index) {
    if (index < 0 || index >= panels.length) return;
    panels.forEach(function (panel, i) {
      panel.classList.toggle("is-active", i === index);
    });
  }

  setActive(defaultIndex);

  panels.forEach(function (panel, index) {
    panel.addEventListener("mouseenter", function () {
      if (!isTouch) setActive(index);
    });

    panel.addEventListener("focusin", function () {
      setActive(index);
    });

    panel.addEventListener("click", function (e) {
      if (isTouch && !panel.classList.contains("is-active")) {
        e.preventDefault();
        setActive(index);
        return;
      }
      setActive(index);
    });
  });
})();
