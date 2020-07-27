import * as React from "react";
import styled from "styled-components";

declare namespace TetrisBoard {
  interface TetrisBoardProps {
    field: (number | string)[][];
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
  const field = buildFieldMatrix(WIDTH, HEIGHT);

  return (
    <div>
      {field.map((row) => (
        <Row>
          {row.map(() => (
            <Cell backgroundColor="grey" />
          ))}
        </Row>
      ))}
    </div>
  );
};

export function buildFieldMatrix(width: number, height: number) {
  const field = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(0);
    }
    field.push(row);
  }

  return field;
}

export default TetrisBoard;
