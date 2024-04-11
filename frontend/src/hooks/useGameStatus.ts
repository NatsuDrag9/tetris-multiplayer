import {
  INITAL_ROWS,
  INITIAL_LEVEL,
  INITIAL_SCORE,
  LINE_POINTS,
} from '@constants/game';
import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line implicit-arrow-linebreak
const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [rows, setRows] = useState<number>(INITAL_ROWS);
  const [level, setLevel] = useState<number>(INITIAL_LEVEL);

  // Calculates the score
  const calculateScore = useCallback(() => {
    if (rowsCleared > 0) {
      // Score formula from web
      setScore((prev) => prev + LINE_POINTS[rowsCleared - 1] * (level + 1));
      setRows((prev) => prev + rowsCleared);
    }
  }, [level, rowsCleared]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore, rowsCleared, score]);

  return {
    score,
    setScore,
    rows,
    setRows,
    level,
    setLevel,
  };
};

export default useGameStatus;
