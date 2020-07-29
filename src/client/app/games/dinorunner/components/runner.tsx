// Based off of https://github.com/TylerPottsDev/chrome-dino-replica

import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

import Obstacle from "../classes/obstacle";
import Player from "../classes/player";

import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_SPEED, GRAVITY, INITIAL_SPAWN_TIMER } from "../constants";

let nextSpawn = INITIAL_SPAWN_TIMER;
let obstacles: Obstacle[] = [];

const keys = {};

// Event Listeners
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

const Runner: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Player>(null);
  // const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  // const [nextSpawn, setNextSpawn] = useState(initialSpawnTimer);

  const reqAnimRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const update = () => {
    if (!canvasRef) {
      return;
    }

    reqAnimRef.current = requestAnimationFrame(update);
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (nextSpawn <= 0) {
      spawnObstacle();
      nextSpawn = randomNumber(40, 60);
    } else {
      nextSpawn--;
    }

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
        nextSpawn = INITIAL_SPAWN_TIMER;
      }

      obstacle.update();
    });

    player.animate();
  };

  const spawnObstacle = () => {
    // TODO: Make the random number a bit more fixed between 4 heights
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
    if (canvasRef !== null) {
      const newPlayer = new Player({
        ctx: canvasRef.current.getContext("2d"),
        keys,
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
      reqAnimRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (reqAnimRef) {
        cancelAnimationFrame(reqAnimRef.current);
      }
    };
  }, [player]);

  return (
    <div>
      <h1>DinoRunner</h1>
      <canvas style={{ display: "block" }} ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export default Runner;
