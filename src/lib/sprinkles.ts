/**
 * Luxury Festive Sprinkles & Confetti Burst System
 * Spawns celebratory gold, emerald, rose, and amber sprinkle particles
 * when the user clicks 'ADD TO CART' or adds an item to their order.
 */

interface SprinkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  color: string;
  shape: "rect" | "circle" | "star";
  size: number;
  width: number;
  height: number;
  opacity: number;
  decay: number;
}

const LUXURY_PALETTE = [
  "#d4af37", // Haute Gold
  "#f6e05e", // Light Gold
  "#1b5e3f", // Emerald Green
  "#34d399", // Fresh Mint
  "#f472b6", // Rose Gold
  "#fb7185", // Coral Glow
  "#f59e0b", // Warm Amber
  "#ffffff", // Shimmering White
];

export function triggerSprinkles(origin?: { x: number; y: number } | MouseEvent | React.MouseEvent) {
  if (typeof window === "undefined") return;

  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (origin) {
    if ("clientX" in origin && typeof origin.clientX === "number") {
      startX = origin.clientX;
      startY = origin.clientY;
    } else if ("x" in origin && typeof origin.x === "number") {
      startX = origin.x;
      startY = origin.y;
    }
  }

  // Create or reuse full-screen overlay canvas
  let canvas = document.getElementById("sprinkles-canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "sprinkles-canvas";
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const particleCount = 55;
  const particles: SprinkleParticle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 7 + Math.random() * 9;
    const color = LUXURY_PALETTE[Math.floor(Math.random() * LUXURY_PALETTE.length)];
    const shapeRoll = Math.random();
    const shape: "rect" | "circle" | "star" =
      shapeRoll > 0.4 ? "rect" : shapeRoll > 0.15 ? "circle" : "star";

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.5, // Pop upwards
      angle: Math.random() * 360,
      vAngle: (Math.random() - 0.5) * 14,
      color,
      shape,
      size: 4 + Math.random() * 5,
      width: 7 + Math.random() * 7,
      height: 3 + Math.random() * 3,
      opacity: 1,
      decay: 0.012 + Math.random() * 0.014,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0) continue;

      activeCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // Gravity
      p.vx *= 0.98; // Air resistance
      p.angle += p.vAngle;
      p.opacity -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.beginPath();
        // Rounded sprinkle rect
        const w = p.width;
        const h = p.height;
        ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, 2) : ctx.rect(-w / 2, -h / 2, w, h);
        ctx.fill();
      } else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Star sparkle
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrameId = requestAnimationFrame(render);
}
