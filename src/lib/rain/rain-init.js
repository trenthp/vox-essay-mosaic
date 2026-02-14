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
    const textureBgSize = { width: 384, height: 256 };
    const textureBg = createCanvas(textureBgSize.width, textureBgSize.height);
    const bgCtx = textureBg.getContext("2d");
    bgCtx.drawImage(sceneBgImg, 0, 0, textureBgSize.width, textureBgSize.height);

    // Foreground texture: same image but blurred (seen through droplet refraction)
    const textureFgSize = { width: 96, height: 64 };
    const textureFg = createCanvas(textureFgSize.width, textureFgSize.height);
    const fgCtx = textureFg.getContext("2d");
    fgCtx.filter = "blur(2px)";
    fgCtx.drawImage(sceneBgImg, 0, 0, textureFgSize.width, textureFgSize.height);

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
