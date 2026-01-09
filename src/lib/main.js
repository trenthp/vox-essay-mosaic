/* ========================================
   MAIN.JS
   Shared functionality - optimized
   ======================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
