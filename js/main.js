/* ========================================
   MAIN.JS
   Shared functionality across all themes
   ======================================== */

// Custom cursor
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  if (cursor) {
    cursor.style.left = cursorX - 4 + 'px';
    cursor.style.top = cursorY - 4 + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Floating words parallax
const floatWords = document.querySelectorAll('.float-word');
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;

  floatWords.forEach((word, i) => {
    const speed = (i + 1) * 8;
    const currentRotation = word.dataset.rotation || '0deg';
    word.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${currentRotation})`;
  });
});

// Store original rotations for floating words
floatWords.forEach((word) => {
  const transform = window.getComputedStyle(word).transform;
  const match = word.style.transform?.match(/rotate\(([^)]+)\)/);
  if (match) {
    word.dataset.rotation = match[1];
  }
});

// Form handling
const form = document.getElementById('emailForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const button = this.querySelector('button span');
    const originalText = button.textContent;

    this.classList.add('success');
    button.textContent = "You're in";

    console.log('Email:', email);

    setTimeout(() => {
      this.classList.remove('success');
      button.textContent = originalText;
      this.reset();
    }, 3000);
  });
}

// Intersection observer for animations
const observerOptions = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.mosaic-tile').forEach(tile => {
  tile.style.opacity = '0';
  tile.style.transform = 'translateY(30px)';
  tile.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  observer.observe(tile);
});
