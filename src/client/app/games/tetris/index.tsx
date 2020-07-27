import * as React from "react";
import styled from "styled-components";
import { BLOCKS, rotateTetromino } from "./blocks/tetrominos";
import Board from "./board/board";

const Title = styled.h1`
  color: white;
`;

const Tetris: React.FC = () => {
  const block = BLOCKS.T;
  const rotateOnce = rotateTetromino(block);
  const rotateTwice = rotateTetromino(rotateOnce);
  console.log(rotateOnce);
  console.log(rotateTwice);

  return (
    <div>
      <Title>ProcrastiTetris</Title>
      <Board field={null} />
    </div>
  );
};

export default Tetris;
