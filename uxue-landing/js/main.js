(function () {
  // 3D tilt of the phone based on cursor position
  const wrap = document.getElementById('phoneTilt');
  const frame = document.getElementById('phoneFrame');
  if (wrap && frame) {
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 16;
      const ry = (x - 0.5) * 16;
      frame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotateX(0) rotateY(0)';
    });
  }

  // Scroll progress thumb inside the phone screen
  const screen = document.getElementById('phoneScreen');
  const thumb = document.getElementById('scrollThumb');
  if (screen && thumb) {
    function updateThumb() {
      const track = screen.parentElement.querySelector('.scroll-track');
      const trackHeight = track.clientHeight;
      const ratio = screen.scrollTop / (screen.scrollHeight - screen.clientHeight || 1);
      const thumbH = trackHeight * 0.2;
      const top = ratio * (trackHeight - thumbH);
      thumb.style.top = top + 'px';
    }
    screen.addEventListener('scroll', updateThumb);
    updateThumb();
  }
})();
