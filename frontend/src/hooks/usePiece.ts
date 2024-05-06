import { GameMode, STAGE_WIDTH } from '@constants/game';
import { TETROMINOES } from '@constants/tetrominoes';
import { useMultiplayerGameContext } from '@contexts/MultiplayerGameContext';
import { StageType } from '@customTypes/gameTypes';
import { Piece } from '@customTypes/pieceTypes';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { checkCollision } from '@utils/game-helpers';
import getRandomTetromino from '@utils/get-random-tetromino';
import { useCallback, useState } from 'react';

const usePiece = (gameMode: string) => {
  const [piece, setPiece] = useState<Piece>({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOES[0].shape,
    collided: false,
  });
  const { increasePenalty, updatePenaltyIncurred } =
    useMultiplayerGameContext();

  // Rotates the tetromino
  const rotate = (matrix: TetrominoShape, direction: number) => {
    // Make the rows to become columns (transpose)
    const rotatedTetromino = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );

    // Reverse each row to get the roated matrix
    // if rotation is clockwise
    if (direction > 0) {
      return rotatedTetromino.map((row) => row.reverse());
    }
    // Else reverse the matrix if the rotation is
    // anticlockwise
    return rotatedTetromino.reverse();
  };

  // Piece rotate
  const pieceRotate = (stage: StageType, direction: number) => {
    // Make a copy of the piece to prevent changing the contents
    // of the original piece
    const pieceCopy = JSON.parse(JSON.stringify(piece));
    pieceCopy.tetromino = rotate(pieceCopy.tetromino, direction);

    // Checks for collision when rotating
    const pos = pieceCopy.position.x;
    let offset = 1;
    while (checkCollision(pieceCopy, stage, { x: 0, y: 0 })) {
      pieceCopy.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      // Rotate the tetromino to its original direction if
      // looped through the complete length of the tetromino
      if (offset > pieceCopy.tetromino[0].length) {
        rotate(pieceCopy.tetromino, -direction);
        pieceCopy.position.x = pos;
        return;
      }
    }
    setPiece(pieceCopy);
  };

  // Updates the position of the piece to the received
  // parameters
  const updatePiecePosition = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPiece((prev) => ({
      ...prev,
      position: { x: prev.position.x + x, y: prev.position.y + y },
      tetromino: prev.tetromino,
      collided,
    }));
  };

  const performTurnTasks = useCallback(
    (tetromino: TetrominoShape | null): TetrominoShape => {
      if (gameMode === GameMode.MULTI_PLAYER) {
        if (tetromino !== null) {
          updatePenaltyIncurred(false);
          return tetromino;
        }
        updatePenaltyIncurred(true);
        increasePenalty();
        return getRandomTetromino().shape;
      }
      return tetromino !== null ? tetromino : getRandomTetromino().shape;
    },
    [gameMode, increasePenalty, updatePenaltyIncurred]
  );

  // Resets the piece state. Callback doesn't depend on
  // anything because the function is only called once
  const resetPiece = useCallback(
    (tetromino: TetrominoShape | null) => {
      setPiece({
        position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: performTurnTasks(tetromino),
        collided: false,
      });
    },
    [performTurnTasks]
  );

  return {
    piece,
    updatePiecePosition,
    resetPiece,
    pieceRotate,
  };
};

export default usePiece;
