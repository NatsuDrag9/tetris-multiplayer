import { test, assertType } from 'vitest';
import getRandomTetromino from '@utils/get-random-tetromino';
import { Tetromino } from '@customTypes/tetromonoTypes';

test('A random tetromino has return type "Tetrominoes"', () => {
  const randomTetromino = getRandomTetromino();
  assertType<Tetromino>(randomTetromino);
});
