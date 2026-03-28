export interface Vec2 {
  x: number;
  y: number;
}

export interface Kite {
  id: string;
  pos: Vec2;
  vel: Vec2;
  color: string;
  tailColor: string;
  angle: number;
  lineLength: number;
  isAlive: boolean;
  isPlayer: boolean;
  // AI
  targetPos?: Vec2;
  changeTimer?: number;
  aggressiveness?: number;
}

export interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
  opacity: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface FallingKite {
  pos: Vec2;
  vel: Vec2;
  angle: number;
  rotSpeed: number;
  color: string;
  tailColor: string;
  life: number;
}

export type GameState = 'menu' | 'playing' | 'gameover';

