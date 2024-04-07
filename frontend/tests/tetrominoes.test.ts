import { test, assertType } from 'vitest';
import getRandomTetromino from '@utils/getRandomTetromino';
import { Tetrominoes } from '../src/customTypes/tetromonoTypes';

test('A random tetromino has return type "Tetrominoes"', () => {
  const randomTetromino = getRandomTetromino();
  assertType<Tetrominoes>(randomTetromino);
});
