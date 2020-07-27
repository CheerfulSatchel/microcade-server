import { useState, useCallback } from "react";

import { BLOCKS, randomTetromino } from "../blocks/tetrominos";
import { STAGE_WIDTH, checkCollision, Stage } from "../helpers";

export type Matrix = any[][];

export interface Player {
  pos: { x: number; y: number };
  tetromino: any[][];
  collided: boolean;
}
export type UpdatePlayerPosFn = (update: { x: number; y: number; collided?: boolean }) => void;
export type ResetPlayerFn = () => void;
export type PlayerRotateFn = (stage: any, dir: any) => void;

export type UsePlayerHook = [Player, UpdatePlayerPosFn, ResetPlayerFn, PlayerRotateFn];

export const usePlayer: () => UsePlayerHook = () => {
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: BLOCKS[0].shape,
    collided: false,
  });

  function rotate(matrix: Matrix, dir: number) {
    // Make the rows to become cols (transpose)
    const mtrx = matrix.map((_, index) => matrix.map((column) => column[index]));
    // Reverse each row to get a rotaded matrix
    if (dir > 0) return mtrx.map((row) => row.reverse());
    return mtrx.reverse();
  }

  function playerRotate(stage: Stage, dir: number) {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  }

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x += x, y: prev.pos.y += y },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};
