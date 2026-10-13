import { useEffect, useRef } from 'react';

/* ─── Glyph streams behind the hero card ──────────────────────────
   Letters from Indian scripts stream in toward the card on one side
   (questions, in any language) and section marks stream out the other
   (the law they map to). Square tiles sit on the field, each wired to
   the card by an elbow line.

   Drawn on one canvas so a few hundred moving characters cost a single
   paint. It stops when the hero is off screen or the tab is hidden, and
   draws one still frame for people who ask for reduced motion.
   ──────────────────────────────────────────────────────────────── */
const IN_GLYPHS  = ['क', 'அ', 'অ', 'త', 'ಕ', 'മ', 'ગ', 'ਪ', 'ଓ', 'म', 'த', 'A', '?', '·'];
const OUT_GLYPHS = ['§', '1', '9', '(', ')', '2', '·', '§', '3', '5', '+', '0'];
const SAFFRON = '201, 78, 0';
const GOLD    = '139, 105, 20';
const INK     = '26, 20, 16';
const SPACING = 17;

const lerp = (a, b, t) => a + (b - a) * t;

function buildScene(section, card, tiles) {
  const s = section.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const W = s.width, H = s.height;
  const box = { l: c.left - s.left, r: c.right - s.left, t: c.top - s.top, b: c.bottom - s.top };
  const stacked = W < 1040; // phone/tablet: streams run down the page instead of across it
  const n = stacked ? 8 : 11;
  const beams = [];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const inward = stacked
      ? { x0: lerp(-0.15 * W, 1.15 * W, t), y0: -12, x1: lerp(box.l + 14, box.r - 14, t), y1: box.t - 4 }
      : { x0: -12, y0: lerp(-0.14 * H, 1.14 * H, t), x1: box.l - 4, y1: lerp(box.t + 14, box.b - 14, t) };
    const outward = stacked
      ? { x0: lerp(box.l + 14, box.r - 14, t), y0: box.b + 4, x1: lerp(-0.15 * W, 1.15 * W, t), y1: H + 12 }
      : { x0: box.r + 4, y0: lerp(box.t + 14, box.b - 14, t), x1: W + 12, y1: lerp(-0.14 * H, 1.14 * H, t) };

    beams.push({ ...inward,  glyphs: IN_GLYPHS,  rgb: i % 3 === 1 ? INK : SAFFRON, cardAt: 'end',
                 speed: 16 + (i * 7) % 11, phase: (i * 53) % 97, seed: i });
    beams.push({ ...outward, glyphs: OUT_GLYPHS, rgb: i % 3 === 1 ? INK : GOLD,    cardAt: 'start',
                 speed: 15 + (i * 5) % 12, phase: (i * 31) % 89, seed: i + 40 });
  }

  // Elbow wires from each tile to the nearest card edge
  const wires = [...tiles].filter((el) => el.offsetParent).map((el, i) => {
    const r = el.getBoundingClientRect();
    const x = r.left - s.left + r.width / 2, y = r.top - s.top + r.height / 2;
    if (stacked) {
      const above = y < box.t;
      const edgeY = above ? box.t : box.b;
      const midY = lerp(above ? r.bottom - s.top : r.top - s.top, edgeY, 0.5);
      const cx = lerp(box.l + 28, box.r - 28, (x / W));
      return [[x, above ? r.bottom - s.top : r.top - s.top], [x, midY], [cx, midY], [cx, edgeY]];
    }
    const left = x < box.l;
    const edgeX = left ? box.l : box.r;
    const from = left ? r.right - s.left : r.left - s.left;
    const midX = lerp(from, edgeX, 0.45 + (i % 2) * 0.2);
    const cy = lerp(box.t + 30, box.b - 30, Math.min(1, Math.max(0, (y - 0.1 * H) / (0.8 * H))));
    return [[from, y], [midX, y], [midX, cy], [edgeX, cy]];
  });

  return { W, H, beams, wires };
}

function draw(ctx, scene, time) {
  const { W, H, beams, wires } = scene;
  ctx.clearRect(0, 0, W, H);

  ctx.lineWidth = 1;
  for (const b of beams) {
    ctx.strokeStyle = `rgba(${b.rgb}, 0.1)`;
    ctx.beginPath(); ctx.moveTo(b.x0, b.y0); ctx.lineTo(b.x1, b.y1); ctx.stroke();
  }

  ctx.font = '500 12px "JetBrains Mono", "Noto Sans", "Nirmala UI", ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const b of beams) {
    const dx = b.x1 - b.x0, dy = b.y1 - b.y0;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const count = Math.floor(len / SPACING);
    for (let k = 0; k < count; k++) {
      const d = (k * SPACING + b.phase + time * b.speed) % len;
      const toCard = b.cardAt === 'end' ? len - d : d;
      const toEdge = b.cardAt === 'end' ? d : len - d;
      // Fade as a glyph reaches the card and where it enters or leaves the page edge
      const alpha = 0.62 * Math.min(1, toCard / 46) * Math.min(1, toEdge / 90);
      if (alpha < 0.03) continue;
      ctx.fillStyle = `rgba(${b.rgb}, ${alpha.toFixed(3)})`;
      ctx.fillText(b.glyphs[(k * 7 + b.seed * 3) % b.glyphs.length], b.x0 + ux * d, b.y0 + uy * d);
    }
  }

  ctx.strokeStyle = `rgba(${INK}, 0.3)`;
  ctx.fillStyle = '#FFFDF9';
  for (const wire of wires) {
    ctx.beginPath();
    wire.forEach(([x, y], i) => (i ? ctx.lineTo(Math.round(x) + 0.5, Math.round(y) + 0.5) : ctx.moveTo(Math.round(x) + 0.5, Math.round(y) + 0.5)));
    ctx.stroke();
    for (const [x, y] of wire.slice(1)) {
      ctx.fillRect(Math.round(x) - 2.5, Math.round(y) - 2.5, 6, 6);
      ctx.strokeRect(Math.round(x) - 2.5, Math.round(y) - 2.5, 6, 6);
    }
  }
}

export default function LandingHeroField({ cardRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas.parentElement;
    const card = cardRef.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scene = null, frame = 0, visible = true;

    const measure = () => {
      scene = buildScene(section, card, section.querySelectorAll('.lp-tile'));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(scene.W * dpr);
      canvas.height = Math.round(scene.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, scene, 0);
    };
    const tick = (ms) => {
      draw(ctx, scene, ms / 1000);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      if (!still && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    measure();
    const resizes = new ResizeObserver(() => { measure(); });
    resizes.observe(section);
    const sight = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    sight.observe(section);
    document.addEventListener('visibilitychange', sync);
    document.fonts?.ready.then(measure); // tile and card sizes settle once the fonts are in
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizes.disconnect();
      sight.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [cardRef]);

  return <canvas ref={canvasRef} className="lp-hero__field" aria-hidden="true" />;
}
