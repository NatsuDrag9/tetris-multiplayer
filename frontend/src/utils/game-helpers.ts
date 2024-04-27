// Create an array of size STAGE_HEIGHT where each row in the array
// contains another array of size STAGE_WIDTH filled with "clear"

import { CLEAR_CELL, STAGE_HEIGHT, STAGE_WIDTH } from '@constants/game';
import { StageType } from '@customTypes/gameTypes';
import { Piece, PiecePosition } from '@customTypes/pieceTypes';

// Representing an empty stage - a STAGE_HEIGHT X STAGE_WIDTH matrix
// eslint-disable-next-line max-len
export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, CLEAR_CELL])
  );

// export const checkCollision = (
//   player: Player,
//   stage: StageType,
//   { x: moveX, y: moveY }: PiecePosition
// ) => {
//   for (let y = 0; y < player.tetromino.length; y += 1) {
//     for (let x = 0; x < player.tetromino[y].length; x += 1) {
//       // Check that the cell is actually of a tetromino
//       if (player.tetromino[y][x] !== 0) {
//         // Checking for out-of-bounds
//         // Check that our move is inside the game area's height and width
//         // Check that the tetromino cell we're moving isn't set to CLEAR_CELL
//         if (
//           !stage[y + player.position.y + moveY] ||
//           !stage[y + player.position.y + moveY][
//             x + player.position.x + moveX
//           ] ||
//           stage[y + player.position.y + moveY][
//             x + player.position.x + moveX
//           ][1] !== CLEAR_CELL
//         ) {
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// };

export const checkCollision = (
  piece: Piece,
  stage: StageType,
  { x: moveX, y: moveY }: PiecePosition
) => {
  for (let y = 0; y < piece.tetromino.length; y += 1) {
    for (let x = 0; x < piece.tetromino[y].length; x += 1) {
      // Check that the cell is actually of a tetromino
      if (piece.tetromino[y][x] !== 0) {
        // Checking for out-of-bounds
        // Check that our move is inside the game area's height and width
        // Check that the tetromino cell we're moving isn't set to CLEAR_CELL
        const nextY = y + piece.position.y + moveY;
        const nextX = x + piece.position.x + moveX;
        const isOutOfBounds = !stage[nextY] || !stage[nextY][nextX];
        const isOccupied =
          stage[nextY] &&
          stage[nextY][nextX] &&
          stage[nextY][nextX][1] !== CLEAR_CELL;

        if (isOutOfBounds || isOccupied) {
          return true;
        }
      }
    }
  }
  return false;
};
