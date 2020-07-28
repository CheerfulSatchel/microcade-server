// Pulled from FreeCodeCamp course https://github.com/weibenfalk/react-tetris-starter-files/tree/master/Stepped%20Solutions/react-tetris%20-%20FINISHED/src

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import { createStage, checkCollision } from "./helpers";

// Custom Hooks
import { useInterval } from "./hooks/useInterval";
import { usePlayer } from "./hooks/usePlayer";
import { useStage } from "./hooks/useStage";
import { useGameStatus } from "./hooks/useGameStatus";

// Components
import Board from "./board/board";
import Display from "./display";
import StartButton from "./startButton";

import "./tetris.scss";
import { Room } from "../../../..//server/services/RoomManager";
import { Events } from "../../../../server/Constants";

export const StyledTetrisWrapper = styled.div`
  background-size: cover;
  overflow: hidden;
`;

export const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;
  aside {
    width: 100%;
    max-width: 200px;
    display: block;
    padding: 0 20px;
  }
`;

const Tetris = ({ match }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  useEffect(() => {
    if (match?.params?.roomName) {
      fetch(`/api/room/${match.params.roomName}`)
        .then((res) => res.json())
        .then((room: Room) => {
          const socket = io.connect();

          socket.on(Events.CONNECT, function () {
            Events;
            socket.emit(Events.CONNECT_TO_ROOM, room.name);
          });

          socket.on(Events.MESSAGE, (message) => console.log(message));
        })
        .catch((e) => console.warn(e));
    }
  }, [match]);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      // Activate the interval again when user releases down arrow.
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1));
      }
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
  };

  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game over!
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    // We don't need to run the interval when we use the arrow down to
    // move the tetromino downwards. So deactivate it for now.
    setDropTime(null);
    drop();
  };

  // This one starts the game
  // Custom hook by Dan Abramov
  useInterval(() => {
    drop();
  }, dropTime);

  // TODO: Spacebar to drop
  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  return (
    <StyledTetrisWrapper role="button" onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <Board stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
