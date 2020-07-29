import { GRAVITY, CANVAS_HEIGHT } from "../constants";

export interface PlayerProps {
  ctx: CanvasRenderingContext2D;
  keys: { [key: string]: boolean };
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

export default class Player {
  ctx: CanvasRenderingContext2D;
  keys: { [key: string]: boolean };
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;

  dy: number;
  jumpForce: number;
  originalHeight: number;
  grounded: boolean;
  jumpTimer: number;

  constructor(props: PlayerProps) {
    this.ctx = props.ctx;
    this.keys = props.keys;
    this.x = props.x;
    this.y = props.y;
    this.w = props.w;
    this.h = props.h;
    this.c = props.c;

    this.dy = 0;
    this.jumpForce = 12;
    this.jumpTimer = 0;
    this.originalHeight = props.h;
    this.grounded = false;
  }

  animate() {
    if (this.keys["Space"] || this.keys["KeyW"]) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    if (this.keys["ShiftLeft"] || this.keys["KeyS"]) {
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    if (this.y + this.h < CANVAS_HEIGHT) {
      this.dy += GRAVITY;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = CANVAS_HEIGHT - this.h;
    }

    this.draw();
  }

  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.c;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.closePath();
  }
}
