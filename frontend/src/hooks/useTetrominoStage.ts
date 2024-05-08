/* eslint-disable max-len */
import { CLEAR_CELL } from '@constants/game';
import { TETROMINOES, TETROMINO_IDENTIFIERS } from '@constants/tetrominoes';
import { StageType } from '@customTypes/gameTypes';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { createTetrominoStage } from '@utils/game-helpers';
import { useCallback, useEffect, useState } from 'react';

const useTetrominoStage = () => {
  const [selectedTetrominoIndex, setSelectedTetrominoIndex] = useState(0);
  const [tetrominoStage, setTetrominoStage] = useState(createTetrominoStage());
  const [selectedTetromino, setSelectedTetromino] = useState<TetrominoShape>(
    TETROMINOES[TETROMINO_IDENTIFIERS[selectedTetrominoIndex]].shape
  );

  const updateTetrominoStage = (newTetromino: TetrominoShape) => {
    const newStage: StageType = createTetrominoStage();
    newTetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        newStage[y][x] = [value, CLEAR_CELL];
      });
    });
    setTetrominoStage(newStage);
  };

  const addNewTetrominoToStage = useCallback(() => {
    const tetrominoIdentifier = TETROMINO_IDENTIFIERS[selectedTetrominoIndex];
    const tetromino = TETROMINOES[tetrominoIdentifier].shape;
    updateTetrominoStage(tetromino);
  }, [selectedTetrominoIndex]);

  useEffect(() => {
    updateTetrominoStage(selectedTetromino);
  }, [selectedTetrominoIndex, selectedTetromino]);

  // Function to switch the active tetromino to the next one
  const switchTetromino = (direction: number) => {
    setSelectedTetrominoIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      if (newIndex < 1) {
        newIndex = TETROMINO_IDENTIFIERS.length - 1;
      } else if (newIndex >= TETROMINO_IDENTIFIERS.length) {
        newIndex = 0;
      }
      setSelectedTetromino(TETROMINOES[TETROMINO_IDENTIFIERS[newIndex]].shape);
      return newIndex;
    });
  };

  // Rotates the currently active tetromino
  const rotateTetromino = () => {
    const rotatedTetromino = selectedTetromino.map((_, rowIndex) =>
      selectedTetromino.map((col) => col[rowIndex]).reverse()
    );
    setSelectedTetromino(rotatedTetromino);
    updateTetrominoStage(rotatedTetromino);
  };

  return {
    tetrominoStage,
    addNewTetrominoToStage,
    rotateTetromino,
    switchTetromino,
    selectedTetrominoIndex,
    selectedTetromino,
  };
};

export default useTetrominoStage;
