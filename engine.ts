import { Kite, Cloud, Particle, FallingKite, Vec2 } from './types';
import {
  KITE_COLORS,
  PLAYER_COLOR,
  NUM_ENEMIES,
  NUM_CLOUDS,
  PLAYER_SPEED,
  AI_SPEED_MIN,
  AI_SPEED_MAX,
  CUT_DISTANCE,
  KITE_SIZE,
} from './constants';
import {
  drawSky,
  drawClouds,
  drawKite,
  drawParticles,
  drawFallingKites,
  drawHUD,
} from './renderer';

export class PipaCombateEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  player: Kite;
  enemies: Kite[];
  clouds: Cloud[];
  particles: Particle[];
  fallingKites: FallingKite[];

  mousePos: Vec2;
  score: number;
  cuts: number;
  isRunning: boolean;
  animFrameId: number | null;
  onGameOver: ((score: number, cuts: number) => void) | null;

  private lastTime: number;
  private respawnTimer: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.mousePos = { x: this.width / 2, y: this.height / 2 };
    this.score = 0;
    this.cuts = 0;
    this.isRunning = false;
    this.animFrameId = null;
    this.onGameOver = null;
    this.lastTime = 0;
    this.respawnTimer = 0;

    this.player = this.createPlayer();
    this.enemies = this.createEnemies();
    this.clouds = this.createClouds();
    this.particles = [];
    this.fallingKites = [];
  }

  createPlayer(): Kite {
    return {
      id: 'player',
      pos: { x: this.width / 2, y: this.height / 2 },
      vel: { x: 0, y: 0 },
      color: PLAYER_COLOR.body,
      tailColor: PLAYER_COLOR.tail,
      angle: 0,
      lineLength: 200,
      isAlive: true,
      isPlayer: true,
    };
  }

  createEnemies(): Kite[] {
    const enemies: Kite[] = [];
    for (let i = 0; i < NUM_ENEMIES; i++) {
      enemies.push(this.createEnemy(i));
    }
    return enemies;
  }

  createEnemy(index: number): Kite {
    const colorSet = KITE_COLORS[(index + 1) % KITE_COLORS.length];
    const margin = 60;
    return {
      id: `enemy-${index}-${Date.now()}`,
      pos: {
        x: margin + Math.random() * (this.width - margin * 2),
        y: margin + Math.random() * (this.height * 0.7 - margin),
      },
      vel: { x: 0, y: 0 },
      color: colorSet.body,
      tailColor: colorSet.tail,
      angle: 0,
      lineLength: 200,
      isAlive: true,
      isPlayer: false,
      targetPos: {
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.7,
      },
      changeTimer: Math.random() * 120 + 60,
      aggressiveness: 0.3 + Math.random() * 0.5,
    };
  }

  createClouds(): Cloud[] {
    return Array.from({ length: NUM_CLOUDS }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height * 0.6,
      width: 40 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }

  spawnCutParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 1,
        color: i % 2 === 0 ? color : '#ffffff',
        size: 2 + Math.random() * 3,
      });
    }
  }

  spawnFallingKite(kite: Kite) {
    this.fallingKites.push({
      pos: { ...kite.pos },
      vel: { x: (Math.random() - 0.5) * 3, y: 1 },
      angle: kite.angle,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      color: kite.color,
      tailColor: kite.tailColor,
      life: 1,
    });
  }

  setMousePos(x: number, y: number) {
    this.mousePos = { x, y };
  }

  updatePlayer() {
    const dx = this.mousePos.x - this.player.pos.x;
    const dy = this.mousePos.y - this.player.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 2) {
      const speed = Math.min(PLAYER_SPEED, dist * 0.08);
      this.player.vel.x = (dx / dist) * speed;
      this.player.vel.y = (dy / dist) * speed;
    } else {
      this.player.vel.x *= 0.9;
      this.player.vel.y *= 0.9;
    }

    this.player.pos.x += this.player.vel.x;
    this.player.pos.y += this.player.vel.y;

    this.player.pos.x = Math.max(KITE_SIZE, Math.min(this.width - KITE_SIZE, this.player.pos.x));
    this.player.pos.y = Math.max(KITE_SIZE, Math.min(this.height - KITE_SIZE * 2, this.player.pos.y));

    this.player.angle = this.player.vel.x * 0.05;
  }

  updateEnemies() {
    this.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      enemy.changeTimer! -= 1;
      if (enemy.changeTimer! <= 0) {
        if (Math.random() < enemy.aggressiveness! && this.player.isAlive) {
          enemy.targetPos = {
            x: this.player.pos.x + (Math.random() - 0.5) * 100,
            y: this.player.pos.y + (Math.random() - 0.5) * 100,
          };
          enemy.changeTimer = 30 + Math.random() * 60;
        } else {
          enemy.targetPos = {
            x: 50 + Math.random() * (this.width - 100),
            y: 30 + Math.random() * (this.height * 0.65),
          };
          enemy.changeTimer = 80 + Math.random() * 120;
        }
      }

      const dx = enemy.targetPos!.x - enemy.pos.x;
      const dy = enemy.targetPos!.y - enemy.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = AI_SPEED_MIN + Math.random() * (AI_SPEED_MAX - AI_SPEED_MIN);

      if (dist > 5) {
        enemy.vel.x += (dx / dist) * speed * 0.05;
        enemy.vel.y += (dy / dist) * speed * 0.05;
      }

      enemy.vel.x *= 0.95;
      enemy.vel.y *= 0.95;

      const maxSpeed = AI_SPEED_MAX;
      const currentSpeed = Math.sqrt(enemy.vel.x ** 2 + enemy.vel.y ** 2);
      if (currentSpeed > maxSpeed) {
        enemy.vel.x = (enemy.vel.x / currentSpeed) * maxSpeed;
        enemy.vel.y = (enemy.vel.y / currentSpeed) * maxSpeed;
      }

      enemy.pos.x += enemy.vel.x;
      enemy.pos.y += enemy.vel.y;

      enemy.pos.x = Math.max(KITE_SIZE, Math.min(this.width - KITE_SIZE, enemy.pos.x));
      enemy.pos.y = Math.max(KITE_SIZE, Math.min(this.height - KITE_SIZE * 2, enemy.pos.y));

      enemy.angle = enemy.vel.x * 0.06;
    });

    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = i + 1; j < this.enemies.length; j++) {
        const a = this.enemies[i];
        const b = this.enemies[j];
        if (!a.isAlive || !b.isAlive) continue;
        const dist = Math.sqrt((a.pos.x - b.pos.x) ** 2 + (a.pos.y - b.pos.y) ** 2);
        if (dist < CUT_DISTANCE && Math.random() < 0.01) {
          const loser = Math.random() < 0.5 ? a : b;
          loser.isAlive = false;
          this.spawnCutParticles(loser.pos.x, loser.pos.y, loser.color);
          this.spawnFallingKite(loser);
        }
      }
    }
  }

  checkCuts() {
    if (!this.player.isAlive) return;

    this.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;
      const dx = this.player.pos.x - enemy.pos.x;
      const dy = this.player.pos.y - enemy.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CUT_DISTANCE) {
        const playerSpeed = Math.sqrt(this.player.vel.x ** 2 + this.player.vel.y ** 2);
        const enemySpeed = Math.sqrt(enemy.vel.x ** 2 + enemy.vel.y ** 2);

        if (playerSpeed >= enemySpeed * 0.7) {
          enemy.isAlive = false;
          this.score += 100;
          this.cuts += 1;
          this.spawnCutParticles(enemy.pos.x, enemy.pos.y, enemy.color);
          this.spawnFallingKite(enemy);
        } else if (Math.random() < 0.3) {
          this.player.isAlive = false;
          this.spawnCutParticles(this.player.pos.x, this.player.pos.y, this.player.color);
          this.spawnFallingKite(this.player);
        }
      }
    });
  }

  updateParticles() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= 0.02;
      return p.life > 0;
    });
  }

  updateFallingKites() {
    this.fallingKites = this.fallingKites.filter(fk => {
      fk.pos.x += fk.vel.x;
      fk.pos.y += fk.vel.y;
      fk.vel.x += (Math.random() - 0.5) * 0.3;
      fk.vel.y += 0.05;
      fk.angle += fk.rotSpeed;
      fk.life -= 0.005;
      return fk.life > 0 && fk.pos.y < this.height + 50;
    });
  }

  updateClouds() {
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.width + c.width) {
        c.x = -c.width;
      }
    });
  }

  respawnEnemies() {
    this.respawnTimer++;
    if (this.respawnTimer > 180) {
      this.respawnTimer = 0;
      const aliveCount = this.enemies.filter(e => e.isAlive).length;
      if (aliveCount < NUM_ENEMIES) {
        const idx = this.enemies.findIndex(e => !e.isAlive);
        if (idx >= 0) {
          this.enemies[idx] = this.createEnemy(idx);
          const side = Math.floor(Math.random() * 2);
          if (side === 0) {
            this.enemies[idx].pos.x = Math.random() < 0.5 ? -20 : this.width + 20;
          } else {
            this.enemies[idx].pos.y = -20;
          }
        }
      }
    }
  }

  update() {
    if (!this.isRunning) return;

    if (this.player.isAlive) {
      this.updatePlayer();
    } else {
      if (this.onGameOver) {
        this.onGameOver(this.score, this.cuts);
        this.isRunning = false;
        return;
      }
    }

    this.updateEnemies();
    this.checkCuts();
    this.updateParticles();
    this.updateFallingKites();
    this.updateClouds();
    this.respawnEnemies();

    if (this.player.isAlive) {
      this.score += 1;
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    drawSky(ctx, w, h);
    drawClouds(ctx, this.clouds);
    drawFallingKites(ctx, this.fallingKites);

    this.enemies.forEach(e => drawKite(ctx, e, h));
    drawKite(ctx, this.player, h);

    drawParticles(ctx, this.particles);

    if (this.player.isAlive) {
      drawHUD(ctx, this.score, this.cuts, w);
    }
  }

  gameLoop = () => {
    this.update();
    this.render();
    if (this.isRunning) {
      this.animFrameId = requestAnimationFrame(this.gameLoop);
    }
  };

  start() {
    this.isRunning = true;
    this.score = 0;
    this.cuts = 0;
    this.respawnTimer = 0;
    this.player = this.createPlayer();
    this.enemies = this.createEnemies();
    this.particles = [];
    this.fallingKites = [];
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }
      }
            
