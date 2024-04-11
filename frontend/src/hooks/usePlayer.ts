import { STAGE_WIDTH } from '@constants/game';
import { StageType } from '@customTypes/gameTypes';
import { Player } from '@customTypes/playerTypes';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { checkCollision } from '@utils/gameHelpers';
import getRandomTetromino from '@utils/getRandomTetromino';
import { useCallback, useState } from 'react';

const usePlayer = (initialTetromino: TetrominoShape) => {
  const [player, setPlayer] = useState<Player>({
    position: { x: 0, y: 0 },
    tetromino: initialTetromino,
    collided: false,
  });

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

  // Player rotate
  const playerRotate = (stage: StageType, direction: number) => {
    // Make a copy of the player to prevent changing the contents
    // of the original player
    const playerCopy = JSON.parse(JSON.stringify(player));
    playerCopy.tetromino = rotate(playerCopy.tetromino, direction);

    // Checks for collision when rotating
    const pos = playerCopy.position.x;
    let offset = 1;
    while (checkCollision(playerCopy, stage, { x: 0, y: 0 })) {
      playerCopy.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      // Rotate the tetromino to its original direction if
      // looped through the complete length of the tetromino
      if (offset > playerCopy.tetromino[0].length) {
        rotate(playerCopy.tetromino, -direction);
        playerCopy.position.x = pos;
        return;
      }
    }
    setPlayer(playerCopy);
  };

  // Updates the position of the player to the received
  // parameters
  const updatePlayerPosition = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPlayer((prev) => ({
      ...prev,
      position: { x: prev.position.x + x, y: prev.position.y + y },
      tetromino: prev.tetromino,
      collided,
    }));
  };

  // Resets the player state. Callback doesn't depend on
  // anything because the function is only called once
  const resetPlayer = useCallback(() => {
    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: getRandomTetromino().shape,
      collided: false,
    });
  }, []);

  return {
    player,
    updatePlayerPosition,
    resetPlayer,
    playerRotate,
  };
};

export default usePlayer;
