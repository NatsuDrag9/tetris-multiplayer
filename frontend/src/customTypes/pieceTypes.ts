import { TetrominoShape } from '@customTypes/tetromonoTypes';

export interface PiecePosition {
  x: number;
  y: number;
}

export interface Piece {
  position: PiecePosition;
  tetromino: TetrominoShape;
  collided: boolean;
}
