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
import ChatComponent from "./../../shared/ChatComponent";

import "./tetris.scss";
import { RoomDTO } from "../../../..//server/services/RoomManager";
import { Events } from "../../../../server/Constants";

// export const Container = styled.div`
//   overflow: hidden;
//   background-size: cover;
//   width: 100%;
//   position: relative;
// `;

export const Container = styled.div``;

// export const StyledChatContainer = styled.div`
//   float: left;
//   height: 100%;
//   top: 50%;
//   transform: translateY(-50%);
//   resize: vertical;
// `;

export const StyledChatContainer = styled.div``;

export const StyledTetrisContainer = styled.div`
  float: left;
`;

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

const Tetris = ({ match, userName }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverText, setGameOverText] = useState("You lost!");
  const [roomName, setRoomName] = useState("");
  const [initialMessages, setInitialMessages] = useState([]);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  function cleanupSocket() {
    if (socket) {
      socket.disconnect();
    }
  }

  useEffect(() => {
    console.log("MATCCHH " + match);
    if (match?.params?.roomName && !socket) {
      fetch(`/api/room/${match.params.roomName}`)
        .then((res) => res.json())
        .then((room: RoomDTO) => {
          const socket = io();
          setSocket(socket);

          setRoomName(room.name);
          setInitialMessages(room.chatMessages);

          socket.on(Events.CONNECT, function () {
            socket.emit(Events.CONNECT_TO_ROOM, room.name, userName);
          });

          socket.on(Events.MESSAGE, (messages: string[]) => console.log(messages));

          socket.on(Events.START_GAME, () => {
            startGame();
          });

          socket.on(Events.WINNER, () => {
            setGameOverText("You won!");
            setGameOver(true);
            setDropTime(null);
          });

          socket.on(Events.LOSER, () => {
            setGameOverText("You lost!");
            setGameOver(true);
            setDropTime(null);
          });
        })
        .catch((e) => console.warn(e));
    }

    return () => cleanupSocket();
  }, [socket]);

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

  const requestGameStart = () => {
    fetch(`/api/room/start/${match.params.roomName}`, { method: "POST" });
    // TODO: Error handling
  };

  const requestGameFinish = () => {
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
        setDropTime(null);
      });
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
        requestGameFinish();
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

  const hardDrop = () => {
    let possibleY = 1;

    while (!checkCollision(player, stage, { x: 0, y: possibleY }) && possibleY < 30) {
      possibleY++;
    }

    possibleY--;
    updatePlayerPos({ x: 0, y: possibleY, collided: false });
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
      } else if (keyCode === 32) {
        hardDrop();
      }
    }
  };

  console.log("WHAA");
  console.log(socket);
  return (
    <Container>
      <StyledTetrisContainer>
        <StyledTetrisWrapper tabIndex={0} role="button" onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
          <StyledTetris>
            <Board stage={stage} />
            <aside>
              {gameOver ? (
                <Display gameOver={gameOver} text={gameOverText} />
              ) : (
                <div>
                  <Display text={`Score: ${score}`} />
                  <Display text={`rows: ${rows}`} />
                  <Display text={`Level: ${level}`} />
                </div>
              )}
              <StartButton callback={requestGameStart} disabled={gameOver} />
            </aside>
          </StyledTetris>
        </StyledTetrisWrapper>
      </StyledTetrisContainer>
      <StyledChatContainer>
        {socket && roomName && initialMessages ? (
          <ChatComponent
            connectedWebsocket={socket}
            userName={userName}
            roomName={roomName}
            initialMessages={initialMessages}
          />
        ) : null}
      </StyledChatContainer>
    </Container>
  );
};

export default Tetris;
