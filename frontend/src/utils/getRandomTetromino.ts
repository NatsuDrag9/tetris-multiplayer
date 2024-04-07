import { TETROMINOES, TETROMINO_IDENTIFIERS } from '@constants/tetrominoes';
import { Tetromino } from '@customTypes/tetromonoTypes';

const getRandomTetromino = (): Tetromino => {
  const randomTetrominoIndex =
    TETROMINO_IDENTIFIERS[
      Math.floor(Math.random() * TETROMINO_IDENTIFIERS.length)
    ];
  return TETROMINOES[randomTetrominoIndex];
};

export default getRandomTetromino;
