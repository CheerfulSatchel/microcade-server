// Based off of https://github.com/TylerPottsDev/chrome-dino-replica

import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import Obstacle from "../classes/obstacle";
import Player from "../classes/player";

import Display from "./display";
import StartButton from "./startButton";

import { CANVAS_WIDTH, CANVAS_HEIGHT, INITIAL_SPAWN_TIMER } from "../constants";
import { Events } from "../../../../../server/Constants";
import { Room } from "../../../../../server/services/RoomManager";

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

const StyledStage = styled.div`
  border: 2px solid #333;
  background: #111;
  margin-right: 24px;
`;

const Container = styled.div`
  display: flex;
`;

const Runner = ({ match }) => {
  const [score, setScore] = useState(0);
  const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
  const [player, setPlayer] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(true);
  const [gameOverText, setGameOverText] = useState("Press start!");

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

      // Player collided
      if (
        player?.x < obstacle.x + obstacle.w &&
        player?.x + player.w > obstacle.x &&
        player?.y < obstacle.y + obstacle.h &&
        player?.y + player?.h > obstacle.y
      ) {
        obstacles = [];
        nextSpawn = INITIAL_SPAWN_TIMER;
        setScore(0);
        requestGameFinish();
      }

      obstacle.update();
    });

    setScore((score) => score + 1);
    player.animate();
  };

  const spawnObstacle = () => {
    /*
      TODO: Make the random number a bit more fixed between 4 heights
      ground
      low (crouch)
      mid (short jump)
      high (high jump);
    */
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

    obstacles.push(obstacle);
  };

  const startGame = () => {
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
    setGameOver(false);
  };

  const cleanupSocket = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    if (match?.params?.roomName && !socket) {
      fetch(`/api/room/${match.params.roomName}`)
        .then((res) => res.json())
        .then((room: Room) => {
          const socket = io();
          setSocket(socket);

          socket.on(Events.CONNECT, function () {
            socket.emit(Events.CONNECT_TO_ROOM, room.name);
          });

          socket.on(Events.MESSAGE, (message) => console.log(message));

          socket.on(Events.START_GAME, () => {
            startGame();
          });

          socket.on(Events.WINNER, () => {
            setGameOverText("You won!");
            setGameOver(true);
          });

          socket.on(Events.LOSER, () => {
            setGameOverText("You lost!");
            setGameOver(true);
          });
        })
        .catch((e) => console.warn(e));
    }

    return () => cleanupSocket();
  }, [socket]);

  useEffect(() => {
    if (!gameOver) {
      startGame();
    } else {
      cancelAnimationFrame(reqAnimRef.current);
    }
  }, [gameOver]);

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

  const requestGameFinish = () => {
    cancelAnimationFrame(reqAnimRef.current);
    fetch(`/api/room/finish/${match.params.roomName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ socketId: socket.id }),
    })
      .then(() => {})
      .catch((e) => {
        setGameOver(true);
      });
  };

  const requestGameStart = () => {
    fetch(`/api/room/start/${match.params.roomName}`, { method: "POST" });
    // TODO: Error handling
  };

  return (
    <div>
      <h1>DinoRunner</h1>
      <Container>
        <StyledStage>
          <canvas style={{ display: "block" }} ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        </StyledStage>
        <aside>
          {gameOver ? (
            <Display text={gameOverText} />
          ) : (
            <div>
              <Display text={`Distance: ${Math.floor(score / 10)}`} />
            </div>
          )}
          <StartButton callback={requestGameStart} disabled={!gameOver} />
        </aside>
      </Container>
    </div>
  );
};

function randomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export default Runner;
