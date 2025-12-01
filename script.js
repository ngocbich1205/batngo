// -----------------------------
// Helpers & resize handling
// -----------------------------
function fitCanvasToWindow(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
  fitCanvasToWindow(document.getElementById('matrix'));
  fitCanvasToWindow(document.getElementById('titleCanvas'));
  // redraw target text if needed (we recompute on start)
});

// -----------------------------
// Background Matrix effect
// -----------------------------
const matrixCanvas = document.getElementById('matrix');
const mctx = matrixCanvas.getContext('2d');
fitCanvasToWindow(matrixCanvas);

const chars = "HAPPYBIRTHDAY".split("");
const fontSize = 16;
let cols = Math.floor(matrixCanvas.width / fontSize);
let drops = Array.from({ length: cols }).fill(1);

function resetMatrix() {
  cols = Math.floor(matrixCanvas.width / fontSize);
  drops = Array.from({ length: cols }).fill(1);
}

function drawMatrix() {
  mctx.fillStyle = "rgba(0,0,0,0.06)";
  mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  mctx.fillStyle = "#ff80c8";
  mctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    mctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 45);
window.addEventListener('resize', resetMatrix);

// -----------------------------
// Play background music (user gesture fallback)
// -----------------------------
const bgm = document.getElementById('bgm');
function tryPlayMusic() {
  const p = bgm.play();
  if (p !== undefined) {
    p.catch(() => {
      // blocked — play on first user click
      const onClickPlay = () => {
        bgm.play();
        window.removeEventListener('click', onClickPlay);
      };
      window.addEventListener('click', onClickPlay, { once: true });
    });
  }
}
tryPlayMusic();

// -----------------------------
// Intro typing (Typed.js must be loaded via CDN in index.html)
// -----------------------------
const introEl = document.getElementById('intro');
const countdownEl = document.getElementById('countdown');

new Typed("#intro-text", {
  strings: [
    "Hôm nay là một ngày thật đặc biệt…",
    "Ai đó vừa lớn thêm một tuổi rồi 🎉💗"
  ],
  typeSpeed: 45,
  backSpeed: 25,
  backDelay: 900,
  showCursor: false,
  onComplete: () => {
    // fade intro then start countdown
    setTimeout(() => {
      introEl.classList.add('hidden');
      // wait a touch for fade
      setTimeout(() => startCountdown(), 500);
    }, 900);
  }
});

// -----------------------------
// Countdown 3-2-1
// -----------------------------
function startCountdown() {
  countdownEl.classList.remove('hidden');
  let n = 3;
  countdownEl.textContent = n;

  const t = setInterval(() => {
    n--;
    if (n >= 1) {
      countdownEl.textContent = n;
    } else {
      clearInterval(t);
      countdownEl.classList.add('hidden');
      // launch the gather animation
      startGatherAnimation();
    }
  }, 1000);
}

// -----------------------------
// Particle gather to "HAPPY BIRTHDAY"
// -----------------------------
const titleCanvas = document.getElementById('titleCanvas');
const tctx = titleCanvas.getContext('2d');

function startGatherAnimation() {
  titleCanvas.classList.remove('hidden');
  fitCanvasToWindow(titleCanvas);

  const TEXT = "Happy Birthday";   // <-- chữ thường đúng yêu cầu
  const PARTICLE_SIZE = 2.5;
  const SAMPLE_GAP = 2;

  const off = document.createElement('canvas');
  const offCtx = off.getContext('2d');
  off.width = titleCanvas.width;
  off.height = titleCanvas.height;

  // Font Dancing Script
  const fontSize = Math.floor(Math.min(window.innerWidth / 3, 90));
  offCtx.font = `${fontSize}px "Dancing Script", cursive`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillStyle = "white";

  const cx = off.width / 2;
  const cy = off.height / 2;
  offCtx.fillText(TEXT, cx, cy);

  const imageData = offCtx.getImageData(0, 0, off.width, off.height);
  const points = [];

  for (let y = 0; y < off.height; y += SAMPLE_GAP) {
    for (let x = 0; x < off.width; x += SAMPLE_GAP) {
      const i = (y * off.width + x) * 4;
      if (imageData.data[i + 3] > 128) points.push({ x, y });
    }
  }

  shuffleArray(points);

  const particles = points.map(pt => ({
    x: Math.random() * titleCanvas.width,
    y: Math.random() * titleCanvas.height,
    tx: pt.x,
    ty: pt.y,
    vx: 0,
    vy: 0,
    size: PARTICLE_SIZE + Math.random() * 1.2,
    speedFactor: 0.025 + Math.random() * 0.03
  }));

  function animate() {
    tctx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);

    // Glow nền cho chữ
    tctx.save();
    tctx.font = `${fontSize}px "Dancing Script", cursive`;
    tctx.fillStyle = "rgba(255,170,240,0.12)";
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    tctx.shadowColor = "rgba(255,150,220,0.45)";
    tctx.shadowBlur = 25;
    tctx.fillText(TEXT, cx, cy);
    tctx.restore();

    for (let p of particles) {
      p.vx += (p.tx - p.x) * p.speedFactor;
      p.vy += (p.ty - p.y) * p.speedFactor;
      p.vx *= 0.88;
      p.vy *= 0.88;
      p.x += p.vx;
      p.y += p.vy;

      const d = Math.hypot(p.tx - p.x, p.ty - p.y);
      const alpha = Math.max(0.3, 1 - d / 100);

      tctx.fillStyle = `rgba(255,90,200,${alpha})`;
      tctx.fillRect(p.x, p.y, p.size, p.size);
    }

    requestAnimationFrame(animate);
  }

  animate();
}



// small util: Fisher-Yates shuffle
function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
