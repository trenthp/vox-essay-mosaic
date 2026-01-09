/* ========================================
   MAIN.JS
   Shared functionality - optimized
   ======================================== */

// Only run parallax if floating words exist and reduced motion not preferred
const floatWords = document.querySelectorAll('.float-word');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (floatWords.length > 0 && !prefersReducedMotion) {
  let mouseX = 0, mouseY = 0;

  // Store original rotations
  floatWords.forEach((word) => {
    const match = word.style.transform?.match(/rotate\(([^)]+)\)/);
    if (match) {
      word.dataset.rotation = match[1];
    }
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function updateParallax() {
    floatWords.forEach((word, i) => {
      const speed = (i + 1) * 8;
      const currentRotation = word.dataset.rotation || '0deg';
      word.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px) rotate(${currentRotation})`;
    });
    requestAnimationFrame(updateParallax);
  }
  updateParallax();
}

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

// Intersection observer for tile animations
const tiles = document.querySelectorAll('.mosaic-tile');

if (tiles.length > 0 && !prefersReducedMotion) {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  tiles.forEach((tile, index) => {
    tile.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(tile);
  });
}
