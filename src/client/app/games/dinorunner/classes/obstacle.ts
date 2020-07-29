import { GAME_SPEED } from "../constants";

export interface ObstacleProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

export default class Obstacle {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
  dx: number;

  constructor(props: ObstacleProps) {
    const { ctx, x, y, w, h, c } = props;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -GAME_SPEED;
  }

  update() {
    this.x += this.dx;
    this.draw();
    this.dx = -GAME_SPEED;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.c;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.closePath();
  }
}
