export type TetrominoShape = Array<Array<number | string>>;

export interface Tetromino {
  shape: TetrominoShape;
  color: string;
}

export interface Tetrominoes {
  [key: string]: Tetromino;
}
