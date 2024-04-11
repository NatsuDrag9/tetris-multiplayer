import { CLEAR_CELL, INITIAL_ROWS_CLEARED, MERGE_CELL } from '@constants/game';
import { StageType } from '@customTypes/gameTypes';
import { Player } from '@customTypes/playerTypes';
import { createStage } from '@utils/gameHelpers';
import { useState, useEffect } from 'react';

const useStage = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(INITIAL_ROWS_CLEARED);

  useEffect(() => {
    setRowsCleared(0);

    // Clearing rows logic - if n rows are filled then add n empty rows
    // at the top by using unshift and return the accumulated array
    // If the row contains 0 then it shouldn't be cleared
    const clearRows = (newStage: StageType) =>
      newStage.reduce((acc: StageType, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          // Row does not contain empty cells
          setRowsCleared((prev) => prev + 1);
          acc.unshift(new Array(newStage[0].length).fill([0, CLEAR_CELL]));

          return acc;
        }
        acc.push(row);
        return acc;
      }, []);

    const updateStage = (prevStage: StageType) => {
      // Flush the stage first
      // eslint-disable-next-line implicit-arrow-linebreak
      const newStage: StageType = prevStage.map((row) =>
        // Checks if the cell in the row is clear (empty)
        // eslint-disable-next-line implicit-arrow-linebreak
        row.map((cell) => (cell[1] === CLEAR_CELL ? [0, CLEAR_CELL] : cell))
      );

      // Draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // Prevents out-of-bounds due to continuous down arrow key presses
            newStage[y + player.position.y][x + player.position.x] = [
              value,
              `${player.collided ? MERGE_CELL : CLEAR_CELL}`,
            ];
          }
        });
      });

      if (player.collided) {
        resetPlayer();
        return clearRows(newStage);
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return {
    stage,
    setStage,
    rowsCleared,
  };
};

export default useStage;
