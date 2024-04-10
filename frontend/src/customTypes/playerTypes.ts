import { TetrominoShape } from '@customTypes/tetromonoTypes';

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface Player {
  position: PlayerPosition;
  tetromino: TetrominoShape;
  collided: boolean;
}
