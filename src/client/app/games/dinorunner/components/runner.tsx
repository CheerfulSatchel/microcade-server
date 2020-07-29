// Based off of https://github.com/TylerPottsDev/chrome-dino-replica

import React, { useRef, useState, useEffect } from "react";

const CANVAS_WIDTH = window.innerWidth - 240;
const CANVAS_HEIGHT = window.innerHeight - 80;
const gameSpeed = 5;
const gravity = 1;
const initialSpawnTimer = 120;
let nextSpawn = initialSpawnTimer;

const keys = {};

let obstacles: Obstacle[] = [];

// Event Listeners
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

interface PlayerProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

class Player {
  ctx: CanvasRenderingContext2D;
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
    if (keys["Space"] || keys["KeyW"]) {
      this.jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys["ShiftLeft"] || keys["KeyS"]) {
      this.h = this.originalHeight / 2;
    } else {
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    if (this.y + this.h < CANVAS_HEIGHT) {
      this.dy += gravity;
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

interface ObstacleProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}

class Obstacle {
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

    this.dx = -gameSpeed;
  }

  update() {
    this.x += this.dx;
    this.draw();
    this.dx = -gameSpeed;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.c;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.closePath();
  }
}

const Runner: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Player>(null);
  // const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  // const [nextSpawn, setNextSpawn] = useState(initialSpawnTimer);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const update = () => {
    if (!canvasRef) {
      return;
    }

    requestAnimationFrame(update);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (nextSpawn <= 0) {
      spawnObstacle();
      nextSpawn = randomNumber(40, 60);
    } else {
      nextSpawn--;
    }

    // const newObstacles = [...obstacles];

    obstacles.forEach((obstacle, i) => {
      if (obstacle.x + obstacle.w < 0) {
        obstacles.splice(i, 1);
      }

      if (
        player?.x < obstacle.x + obstacle.w &&
        player?.x + player.w > obstacle.x &&
        player?.y < obstacle.y + obstacle.h &&
        player?.y + player?.h > obstacle.y
      ) {
        obstacles = [];
        setScore(0);
        // setNextSpawn(initialSpawnTimer);
        nextSpawn = initialSpawnTimer;
      }

      obstacle.update();
    });

    // setObstacles(newObstacles);

    player.animate();
  };

  const spawnObstacle = () => {
    const size = randomNumber(40, 70);
    const addedY = randomNumber(20, 100);
    const type = randomNumber(0, 1);
    const obstacle = new Obstacle({
      ctx: canvasRef.current.getContext("2d"),
      x: CANVAS_WIDTH + size,
      y: CANVAS_HEIGHT - addedY,
      w: size,
      h: size,
      c: "#2484E4",
    });

    if (type === 1) {
      obstacle.y -= player.originalHeight - 10;
    }

    // setObstacles([...obstacles, obstacle]);
    obstacles.push(obstacle);
  };

  useEffect(() => {
    console.log("Canvas effect");
    if (canvasRef !== null) {
      const newPlayer = new Player({
        ctx: canvasRef.current.getContext("2d"),
        x: 25,
        y: 0,
        w: 50,
        h: 50,
        c: "#FF5858",
      });
      setPlayer(newPlayer);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (player !== null) {
      requestAnimationFrame(update);
    }
  }, [player]);

  return (
    <div>
      <canvas style={{ display: "block" }} ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export default Runner;
