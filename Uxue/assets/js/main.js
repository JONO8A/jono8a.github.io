/* ═══════════════════════════════════════════════════════════
   UXUE GOMEZ — Main Scripts
   1. Phone tilt (hero)
   2. Phone scroll thumb (hero)
   3. Portfolio 3-D tilt cards
   4. Instagram phone switcher (Lo ultimo)
═══════════════════════════════════════════════════════════ */

(function () {

  /* ── 1 & 2. Hero phone tilt + scroll thumb ── */
  var wrap  = document.getElementById("phoneTilt");
  var frame = document.getElementById("phoneFrame");
  if (wrap && frame) {
    wrap.addEventListener("mousemove", function (e) {
      var r  = wrap.getBoundingClientRect();
      var x  = (e.clientX - r.left)  / r.width;
      var y  = (e.clientY - r.top)   / r.height;
      var rx = (0.5 - y) * 16;
      var ry = (x - 0.5) * 16;
      frame.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    wrap.addEventListener("mouseleave", function () {
      frame.style.transform = "rotateX(0) rotateY(0)";
    });

    var screen = document.getElementById("phoneScreen");
    var thumb  = document.getElementById("scrollThumb");
    if (screen && thumb) {
      function updateThumb() {
        var trackH = screen.parentElement.querySelector(".scroll-track").clientHeight;
        var ratio  = screen.scrollTop / ((screen.scrollHeight - screen.clientHeight) || 1);
        var thumbH = trackH * 0.2;
        thumb.style.top = (ratio * (trackH - thumbH)) + "px";
      }
      screen.addEventListener("scroll", updateThumb);
      updateThumb();
    }
  }

  /* ── 3. Portfolio 3-D tilt ── */
  document.querySelectorAll("#pgrid .pitem").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r  = card.getBoundingClientRect();
      var x  = (e.clientX - r.left)  / r.width;
      var y  = (e.clientY - r.top)   / r.height;
      var rx = (0.5 - y) * 14;
      var ry = (x - 0.5) * 14;
      card.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(1.03)";
      card.style.setProperty("--mx", (x * 100) + "%");
      card.style.setProperty("--my", (y * 100) + "%");
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
  });

  /* ── 4. Instagram phone switcher ── */
  var thumbs = document.querySelectorAll(".ig-thumb");
  var dots   = document.querySelectorAll(".ig-dot");
  var slots  = document.querySelectorAll(".ig-embed-slot");

  function activateSlot(n) {
    thumbs.forEach(function (t, i) { t.classList.toggle("active", i === n); });
    dots.forEach(function   (d, i) { d.classList.toggle("active", i === n); });
    slots.forEach(function  (s, i) { s.classList.toggle("active", i === n); });
  }

  thumbs.forEach(function (t) {
    t.addEventListener("click", function () { activateSlot(+this.dataset.slot); });
  });
  dots.forEach(function (d) {
    d.addEventListener("click", function () { activateSlot(+this.dataset.slot); });
  });

})();
