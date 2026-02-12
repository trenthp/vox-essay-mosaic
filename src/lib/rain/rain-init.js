import Raindrops from "./raindrops";
import RainRenderer from "./rain-renderer";
import ImageLoader from "./image-loader";
import createCanvas from "./create-canvas";

// Foggy dew palette for texture generation
const COLORS = {
  fog: "#E4E8E6",
  mist: "#D5DCDA",
  dew: "#C0CAC6",
  ink: "#1E2823",
};

// Generate a solid-color canvas texture
function generateTexture(width, height, color) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas;
}

// Generate foreground texture (what refracts through the drops)
function generateFgTexture(width, height) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");

  // Cool fog base
  ctx.fillStyle = COLORS.fog;
  ctx.fillRect(0, 0, width, height);

  // Subtle cool gradient for depth through refraction
  let grad = ctx.createRadialGradient(
    width * 0.3, height * 0.4, 0,
    width * 0.3, height * 0.4, width * 0.7
  );
  grad.addColorStop(0, "rgba(192,202,198,0.12)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

// Generate background texture (seen behind the glass)
function generateBgTexture(width, height) {
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");

  // Mistier, slightly darker fog
  ctx.fillStyle = COLORS.mist;
  ctx.fillRect(0, 0, width, height);

  // Soft cloudy patches
  let grad1 = ctx.createRadialGradient(
    width * 0.2, height * 0.3, 0,
    width * 0.2, height * 0.3, width * 0.5
  );
  grad1.addColorStop(0, "rgba(192,202,198,0.3)");
  grad1.addColorStop(1, "transparent");
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, width, height);

  let grad2 = ctx.createRadialGradient(
    width * 0.7, height * 0.6, 0,
    width * 0.7, height * 0.6, width * 0.4
  );
  grad2.addColorStop(0, "rgba(213,220,218,0.25)");
  grad2.addColorStop(1, "transparent");
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

export function initRain(canvasEl) {
  if (!canvasEl) return;

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    canvasEl.style.display = "none";
    return;
  }

  // Skip on mobile / narrow screens for performance
  if (window.innerWidth < 769) {
    canvasEl.style.display = "none";
    return;
  }

  const dpi = window.devicePixelRatio;
  const rect = canvasEl.parentElement.getBoundingClientRect();
  canvasEl.width = rect.width * dpi;
  canvasEl.height = rect.height * dpi;
  canvasEl.style.width = rect.width + "px";
  canvasEl.style.height = rect.height + "px";

  // Load drop textures
  ImageLoader(
    [
      { name: "dropAlpha", src: "/img/rain/drop-alpha.png" },
      { name: "dropColor", src: "/img/rain/drop-color.png" },
    ]
  ).then((images) => {
    const dropAlpha = images.dropAlpha.img;
    const dropColor = images.dropColor.img;

    // Generate brand-colored scene textures
    const textureFgSize = { width: 96, height: 64 };
    const textureBgSize = { width: 384, height: 256 };

    const textureFg = generateFgTexture(textureFgSize.width, textureFgSize.height);
    const textureBg = generateBgTexture(textureBgSize.width, textureBgSize.height);

    // Create raindrops simulation — "light misting" settings
    const raindrops = new Raindrops(
      canvasEl.width,
      canvasEl.height,
      dpi,
      dropAlpha,
      dropColor,
      {
        minR: 10,
        maxR: 40,
        rainChance: 0.06,
        rainLimit: 1,
        dropletsRate: 3,
        dropletsSize: [3.5, 6],
        trailRate: 0.5,
        trailScaleRange: [0.2, 0.45],
        collisionRadius: 0.45,
        collisionRadiusIncrease: 0.0002,
        dropletsCleaningRadiusMultiplier: 0.28,
        globalTimeScale: 0.4,
        autoShrink: true,
        spawnArea: [-0.1, 0.95],
      }
    );

    // Create WebGL renderer
    new RainRenderer(
      canvasEl,
      raindrops.canvas,
      textureFg,
      textureBg,
      null,
      {
        brightness: 1.04,
        alphaMultiply: 6,
        alphaSubtract: 3,
        minRefraction: 256,
        maxRefraction: 512,
        renderShadow: false,
        parallaxBg: 0,
        parallaxFg: 0,
      }
    );
  });
}
