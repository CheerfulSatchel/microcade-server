// import { Block } from "../blocks/tetrominos";
// import { Board, Row } from "../board/board";

export interface Position {
  x: number;
  y: number;
}

export const enum Move {
  Left,
  Right,
  Down,
  Drop, // Do later
}

export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export type Row = (string | number | (string | number)[])[];
export type Stage = Row[];

export const createStage: () => Stage = () =>
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, "clear"]));

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  // Using for loops to be able to return (and break). Not possible with forEach
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // 2. Check that our move is inside the game areas height (y)
          // That we're not go through bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          // 3. Check that our move is inside the game areas width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          // 4. Check that the cell wer'e moving to isn't set to clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== "clear"
        ) {
          return true;
        }
      }
    }
  }
  // 5. If everything above is false
  return false;
};
