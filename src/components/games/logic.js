export const initialBoard = () => {
  let board = Array(4).fill(null).map(() => Array(4).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

export const addRandomTile = (board) => {
  let emptyTiles = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }

  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { x, y } = emptyTiles[randomIndex];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
  return board;
};

const slide = (row) => {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  return arr.concat(zeros);
};

const combine = (row) => {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

const operate = (row) => {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
};

const rotateLeft = (board) => {
  let newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newBoard[i][j] = board[j][3 - i];
    }
  }
  return newBoard;
};

const rotateRight = (board) => {
  let newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newBoard[i][j] = board[3 - j][i];
    }
  }
  return newBoard;
};

export const moveLeft = (board) => {
  return board.map(row => operate(row));
};

export const moveRight = (board) => {
  let newBoard = board.map(row => row.reverse());
  newBoard = newBoard.map(row => operate(row));
  return newBoard.map(row => row.reverse());
};

export const moveUp = (board) => {
  let newBoard = rotateLeft(board);
  newBoard = moveLeft(newBoard);
  return rotateRight(newBoard);
};

export const moveDown = (board) => {
  let newBoard = rotateRight(board);
  newBoard = moveLeft(newBoard);
  return rotateLeft(newBoard);
};
export const isGameOver = (board) => {
  // Check for any empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false; // Found an empty cell, game is not over
      }
    }
  }

  // Check for possible merges horizontally
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false; // Found a possible horizontal merge
      }
    }
  }

  // Check for possible merges vertically
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      if (board[i][j] === board[i + 1][j]) {
        return false; // Found a possible vertical merge
      }
    }
  }

  // If no empty cells and no possible merges, the game is over
  return true;
};