import Raindrops from "./raindrops";
import RainRenderer from "./rain-renderer";
import ImageLoader from "./image-loader";
import createCanvas from "./create-canvas";


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

  // Skip on very small screens for performance
  if (window.innerWidth < 480) {
    canvasEl.style.display = "none";
    return;
  }

  const isMobile = window.innerWidth < 769;
  const dpi = isMobile ? 1 : window.devicePixelRatio;
  const rect = canvasEl.parentElement.getBoundingClientRect();
  canvasEl.width = rect.width * dpi;
  canvasEl.height = rect.height * dpi;
  canvasEl.style.width = rect.width + "px";
  canvasEl.style.height = rect.height + "px";

  // Load drop textures + background photo
  ImageLoader(
    [
      { name: "dropAlpha", src: "/img/rain/drop-alpha.png" },
      { name: "dropColor", src: "/img/rain/drop-color.png" },
      { name: "sceneBg", src: "/img/outside.jpg" },
    ]
  ).then((images) => {
    const dropAlpha = images.dropAlpha.img;
    const dropColor = images.dropColor.img;
    const sceneBgImg = images.sceneBg.img;

    // Draw the photo into a canvas for the background texture
    const textureBgSize = isMobile
      ? { width: 192, height: 128 }
      : { width: 384, height: 256 };
    const textureBg = createCanvas(textureBgSize.width, textureBgSize.height);
    const bgCtx = textureBg.getContext("2d");
    bgCtx.drawImage(sceneBgImg, 0, 0, textureBgSize.width, textureBgSize.height);

    // Foreground texture: same image but blurred (seen through droplet refraction)
    const textureFgSize = isMobile
      ? { width: 48, height: 32 }
      : { width: 96, height: 64 };
    const textureFg = createCanvas(textureFgSize.width, textureFgSize.height);
    const fgCtx = textureFg.getContext("2d");
    fgCtx.filter = "blur(2px)";
    fgCtx.drawImage(sceneBgImg, 0, 0, textureFgSize.width, textureFgSize.height);

    // Lighter config on mobile for performance
    const dropConfig = isMobile
      ? {
          minR: 8,
          maxR: 30,
          rainChance: 0.03,
          rainLimit: 1,
          dropletsRate: 1,
          dropletsSize: [2, 4],
          trailRate: 0.3,
          trailScaleRange: [0.15, 0.35],
          collisionRadius: 0.45,
          collisionRadiusIncrease: 0.0002,
          dropletsCleaningRadiusMultiplier: 0.28,
          globalTimeScale: 0.3,
          autoShrink: true,
          spawnArea: [-0.1, 0.95],
        }
      : {
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
        };

    // Create raindrops simulation
    const raindrops = new Raindrops(
      canvasEl.width,
      canvasEl.height,
      dpi,
      dropAlpha,
      dropColor,
      dropConfig
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
        minRefraction: isMobile ? 128 : 256,
        maxRefraction: isMobile ? 256 : 512,
        renderShadow: false,
        parallaxBg: 0,
        parallaxFg: 0,
      }
    );
  });
}
