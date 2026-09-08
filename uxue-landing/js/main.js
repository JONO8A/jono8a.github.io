(function () {
  const wrap  = document.getElementById('phoneTilt');
  const frame = document.getElementById('phoneFrame');
  const hint  = document.querySelector('.phone-hint');

  // ── Gyroscope state ────────────────────────────────────────────────
  let gyroActive = false;
  let baseGamma = null, baseBeta = null;  // calibration origin
  let targetRx = 0, targetRy = 0;
  let currentRx = 0, currentRy = 0;
  const MAX_ANGLE = 20;
  const LERP = 0.1; // smoothing factor (0=no movement, 1=instant)

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Smooth animation loop – only runs when gyro is active
  function gyroLoop() {
    if (!gyroActive) return;
    currentRx = lerp(currentRx, targetRx, LERP);
    currentRy = lerp(currentRy, targetRy, LERP);
    frame.style.transform = `rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
    requestAnimationFrame(gyroLoop);
  }

  function onOrientation(e) {
    // beta  = front/back tilt  (-180…180)  → rotateX
    // gamma = left/right tilt  (-90…90)    → rotateY
    const beta  = e.beta  ?? 0;
    const gamma = e.gamma ?? 0;

    if (baseBeta  === null) baseBeta  = beta;
    if (baseGamma === null) baseGamma = gamma;

    const dBeta  = beta  - baseBeta;
    const dGamma = gamma - baseGamma;

    targetRx = clamp(-dBeta  * 0.6, -MAX_ANGLE, MAX_ANGLE);
    targetRy = clamp( dGamma * 0.6, -MAX_ANGLE, MAX_ANGLE);
  }

  function startGyro() {
    if (gyroActive) return;
    gyroActive = true;
    baseGamma  = null;
    baseBeta   = null;
    window.addEventListener('deviceorientation', onOrientation, true);
    if (hint) hint.textContent = '¡Inclina el móvil! · desliza dentro para ver más';
    gyroLoop();
  }

  function tryGyro() {
    // iOS 13+ requires a user gesture + explicit permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(state => { if (state === 'granted') startGyro(); })
        .catch(() => {});
    } else if (window.DeviceOrientationEvent) {
      // Android / older iOS – no permission needed
      startGyro();
    }
  }

  // Only activate gyro on touch devices
  if ('ontouchstart' in window) {
    // Ask for permission on the first tap anywhere on the phone widget
    if (wrap) {
      wrap.addEventListener('touchstart', tryGyro, { once: true, passive: true });
    }
  }

  // ── Mouse tilt (desktop fallback) ─────────────────────────────────
  if (wrap && frame) {
    wrap.addEventListener('mousemove', (e) => {
      if (gyroActive) return; // gyro takes priority
      const r  = wrap.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width;
      const y  = (e.clientY - r.top)  / r.height;
      const rx = (0.5 - y) * 16;
      const ry = (x - 0.5) * 16;
      frame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      if (gyroActive) return;
      frame.style.transform = 'rotateX(0) rotateY(0)';
    });
  }

  // ── Scroll progress thumb ─────────────────────────────────────────
  const screen = document.getElementById('phoneScreen');
  const thumb  = document.getElementById('scrollThumb');
  if (screen && thumb) {
    function updateThumb() {
      const track       = screen.parentElement.querySelector('.scroll-track');
      const trackHeight = track.clientHeight;
      const ratio       = screen.scrollTop / (screen.scrollHeight - screen.clientHeight || 1);
      const thumbH      = trackHeight * 0.2;
      const top         = ratio * (trackHeight - thumbH);
      thumb.style.top   = top + 'px';
    }
    screen.addEventListener('scroll', updateThumb);
    updateThumb();
  }
})();

