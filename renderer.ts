import { Kite, Cloud, Particle, FallingKite } from './types';
import { KITE_SIZE } from './constants';

export function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#2b6cb0');
  grad.addColorStop(0.5, '#4299e1');
  grad.addColorStop(1, '#90cdf4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

export function drawClouds(ctx: CanvasRenderingContext2D, clouds: Cloud[]) {
  clouds.forEach(c => {
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.width, c.width * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.width * 0.3, c.y + 5, c.width * 0.6, c.width * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.width * 0.35, c.y + 3, c.width * 0.5, c.width * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

export function drawKite(ctx: CanvasRenderingContext2D, kite: Kite, canvasH: number) {
  if (!kite.isAlive) return;

  const { pos, color, tailColor, angle } = kite;
  const s = KITE_SIZE;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  // Kite body (diamond)
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.7, 0);
  ctx.lineTo(0, s * 0.6);
  ctx.lineTo(-s * 0.7, 0);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Cross pattern
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(0, s * 0.6);
  ctx.moveTo(-s * 0.7, 0);
  ctx.lineTo(s * 0.7, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Tail
  ctx.restore();

  // Draw wavy tail
  ctx.strokeStyle = tailColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const tailStartX = pos.x + Math.sin(angle) * s * 0.6;
  const tailStartY = pos.y + Math.cos(angle) * s * 0.6;
  ctx.moveTo(tailStartX, tailStartY);
  const segments = 8;
  const time = Date.now() / 300;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const tx = tailStartX + Math.sin(time + t * 4) * 12 * t;
    const ty = tailStartY + t * 40;
    ctx.lineTo(tx, ty);
  }
  ctx.stroke();

  // String from kite to bottom
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y + s * 0.6);

  // Slight curve on the string
  const midX = pos.x + (kite.vel?.x || 0) * 8;
  const midY = (pos.y + canvasH) / 2;
  ctx.quadraticCurveTo(midX, midY, pos.x + (kite.vel?.x || 0) * 3, canvasH + 20);
  ctx.stroke();
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function drawFallingKites(ctx: CanvasRenderingContext2D, fallingKites: FallingKite[]) {
  fallingKites.forEach(fk => {
    const alpha = Math.max(0, fk.life);
    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.translate(fk.pos.x, fk.pos.y);
    ctx.rotate(fk.angle);

    const s = KITE_SIZE * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.7, 0);
    ctx.lineTo(0, s * 0.6);
    ctx.lineTo(-s * 0.7, 0);
    ctx.closePath();
    ctx.fillStyle = fk.color;
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  });
}

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  cuts: number,
  w: number,
) {
  // Score background
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.roundRect(10, 10, 160, 60, 10);
  ctx.fill();

  ctx.fillStyle = '#faf089';
  ctx.font = "bold 16px 'Bangers', cursive";
  ctx.fillText('PONTOS', 22, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 28px 'Bangers', cursive";
  ctx.fillText(`${score}`, 22, 60);

  // Cuts
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.roundRect(w - 170, 10, 160, 60, 10);
  ctx.fill();

  ctx.fillStyle = '#fc8181';
  ctx.font = "bold 16px 'Bangers', cursive";
  ctx.textAlign = 'right';
  ctx.fillText('PIPAS CORTADAS', w - 22, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 28px 'Bangers', cursive";
  ctx.fillText(`${cuts}`, w - 22, 60);
  ctx.textAlign = 'left';
}
  
