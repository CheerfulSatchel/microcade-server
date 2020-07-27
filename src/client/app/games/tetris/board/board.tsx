import * as React from "react";
import styled from "styled-components";

export type Board = (number | string)[][];

declare namespace TetrisBoard {
  interface TetrisBoardProps {
    board: Board;
  }
}

const WIDTH = 10;
const HEIGHT = 20;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div<{ backgroundColor?: string }>`
  background-color: ${(props) => props.backgroundColor ?? "none"};
  border: 1px solid #2d2d2d;
  width: 28px;
  height: 28px;
`;

const TetrisBoard: React.FC<TetrisBoard.TetrisBoardProps> = () => {
  const board = buildBoardMatrix(WIDTH, HEIGHT);

  return (
    <div>
      {board.map((row) => (
        <Row>
          {row.map(() => (
            <Cell backgroundColor="grey" />
          ))}
        </Row>
      ))}
    </div>
  );
};

export function buildBoardMatrix(width: number, height: number) {
  const board = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(0);
    }
    board.push(row);
  }

  return board;
}

export default TetrisBoard;
