// Loosely based on FreeCodeCamp course https://github.com/weibenfalk/react-tetris-starter-files/tree/master/Stepped%20Solutions/react-tetris%20-%20FINISHED/src

export interface Block {
  shape: any[][];
  color: string;
}

export const BLOCKS: { [key: string]: Block } = {
  I: {
    shape: [
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
      [0, "I", 0, 0],
    ],
    color: "#A1A1A1",
  },
  J: {
    shape: [
      [0, "J", 0],
      [0, "J", 0],
      ["J", "J", 0],
    ],
    color: "#F1F1F1",
  },
  L: {
    shape: [
      [0, "L", 0],
      [0, "L", 0],
      [0, "L", "L"],
    ],
    color: "#B1B1B1",
  },
  O: {
    shape: [
      ["O", "O"],
      ["O", "O"],
    ],
    color: "#000000",
  },
  S: {
    shape: [
      ["S", 0, 0],
      ["S", "S", 0],
      [0, "S", 0],
    ],
    color: "#555555",
  },
  Z: {
    shape: [
      [0, 0, "Z"],
      [0, "Z", "Z"],
      [0, "Z", 0],
    ],
    color: "#D1D1D1",
  },
  T: {
    shape: [
      ["T", "T", "T"],
      [0, "T", 0],
      [0, 0, 0],
    ],
    color: "#E3E3E3",
  },
};

export const rotateTetromino: (block: Block) => Block = (block) => {
  const oldShape = block.shape;
  const newShape: any[][] = [];

  oldShape.forEach((oldShapeRow, i) => {
    oldShapeRow.forEach((char, j) => {
      let rowReversed = [...oldShapeRow];
      rowReversed.reverse();

      if (!newShape[j]) {
        newShape[j] = [];
      }

      newShape[j][i] = rowReversed[j];
    });
  });

  return {
    ...block,
    shape: newShape,
  };
};
