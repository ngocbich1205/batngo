// ✨ Hiệu ứng chữ rơi kiểu ma trận
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "HAPPY BIRTHDAY ".split("");
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff80b5";
  ctx.font = fontSize + "px Poppins";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 50);

// 🌸 Hiệu ứng gõ chữ
new Typed("#intro-text", {
  strings: [
    "Hôm nay là một ngày thật đặc biệt...",
    "Có ai đó đang lớn thêm một tuổi rồi đấy 🎉"
  ],
  typeSpeed: 50,
  backSpeed: 25,
  showCursor: false,
  onComplete: () => {
    setTimeout(() => {
      document.getElementById("intro").classList.add("hidden");
      document.getElementById("main").classList.remove("hidden");
    }, 1500);
  }
});

// 🎵 Điều khiển nhạc
// 🎵 Điều khiển nhạc
const music = document.getElementById("birthday-audio");
const toggleBtn = document.getElementById("toggleMusic");
let isPlaying = false;

// Tự động phát nhạc khi mở trang (nếu trình duyệt cho phép)
window.addEventListener("load", () => {
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Nếu bị chặn, phát nhạc khi người dùng click lần đầu
      document.addEventListener(
        "click",
        () => {
          music.play();
          isPlaying = true;
          toggleBtn.textContent = "🎵";
        },
        { once: true }
      );
    });
  } else {
    isPlaying = true;
  }
});




// 🎁 Hộp quà mở ra
const giftBox = document.getElementById("gift-box");
const message = document.getElementById("message");
const envelope = document.getElementById("envelope");
const hintText = document.getElementById("hint-text"); // 👉 Thêm dòng này

giftBox.addEventListener("click", () => {
  // 👉 Khi nhấp hộp quà, ẩn dòng hướng dẫn
  if (hintText) {
    hintText.style.display = "none";
  }

  // Hiệu ứng xoay và bùm pháo giấy
  giftBox.querySelector("img").style.transform = "rotateX(90deg)";
  confetti({
    particleCount: 250,
    spread: 120,
    origin: { y: 0.6 },
    colors: ['#ff80b5', '#ffe0f0', '#ffffff']
  });

  // Hiện lời chúc và phong bì sau khi “bùm”
  setTimeout(() => {
    message.classList.remove("hidden");
    envelope.classList.remove("hidden");
  }, 600);
});


// 💌 Mở thư chúc
const letter = document.getElementById("letter");
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.classList.remove("hidden");
});
