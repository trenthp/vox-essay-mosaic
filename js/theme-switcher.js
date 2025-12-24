/* ========================================
   THEME SWITCHER
   Handles theme selection and persistence
   ======================================== */

const ThemeSwitcher = {
  themes: [
    { id: 'editorial', name: 'Editorial', file: 'css/theme-editorial.css' },
    { id: 'minimal', name: 'Minimal', file: 'css/theme-minimal.css' },
    { id: 'brutalist', name: 'Brutalist', file: 'css/theme-brutalist.css' },
    { id: 'neural', name: 'Neural', file: 'css/theme-neural.css' }
  ],

  currentTheme: 'editorial',
  themeLink: null,

  init() {
    this.themeLink = document.getElementById('theme-stylesheet');

    const savedTheme = localStorage.getItem('vox-theme');
    if (savedTheme && this.themes.find(t => t.id === savedTheme)) {
      this.currentTheme = savedTheme;
      this.applyTheme(savedTheme, false);
    }

    this.setupToggle();
    this.setupMenu();
    this.updateActiveState();
  },

  setupToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const menu = document.querySelector('.theme-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('active');
      });

      menu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  },

  setupMenu() {
    const menuButtons = document.querySelectorAll('.theme-menu button[data-theme]');

    menuButtons.forEach(button => {
      button.addEventListener('click', () => {
        const themeId = button.dataset.theme;
        this.applyTheme(themeId, true);
      });
    });
  },

  applyTheme(themeId, animate = true) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme || !this.themeLink) return;

    const doApply = () => {
      this.themeLink.href = theme.file;
      this.currentTheme = themeId;
      localStorage.setItem('vox-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
      this.updateActiveState();
      this.handleThemeEffects(themeId);
    };

    if (animate) {
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        doApply();
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 100);
      }, 300);
    } else {
      doApply();
    }
  },

  handleThemeEffects(themeId) {
    if (window.NeuralNetwork) {
      if (themeId === 'neural') {
        window.NeuralNetwork.start();
      } else {
        window.NeuralNetwork.stop();
      }
    }
  },

  updateActiveState() {
    const menuButtons = document.querySelectorAll('.theme-menu button[data-theme]');
    menuButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.theme === this.currentTheme);
    });

    const menu = document.querySelector('.theme-menu');
    if (menu) {
      menu.classList.remove('active');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ThemeSwitcher.init();
});
