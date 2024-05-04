import './SelectTetromino.scss';
import { useEffect, useState } from 'react';
import TetrominoCell from '@components/TetrominoCell/TetrominoCell';
import useTetrominoStage from '@hooks/useTetrominoStage';
import {
  TETROMINO_STAGE_HEIGHT,
  TETROMINO_STAGE_WIDTH,
  TURN_TIMER,
} from '@constants/game';
import Timer from '@components/Timer/Timer';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface SelectTetrominoProps {
  onSelectedTetromino: (tetromino: TetrominoShape) => void;
  onTimerEnd: (ended: boolean) => void;
}

function SelectTetromino({
  onSelectedTetromino,
  onTimerEnd,
}: SelectTetrominoProps) {
  const {
    tetrominoStage,
    switchTetromino,
    rotateTetromino,
    selectedTetromino,
    addNewTetrominoToStage,
  } = useTetrominoStage();
  useEffect(() => {
    addNewTetrominoToStage();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          switchTetromino(-1);
          break;
        case 'ArrowRight':
          switchTetromino(1);
          break;
        case 'ArrowUp':
          rotateTetromino();
          break;
        case 'Enter':
          onSelectedTetromino(selectedTetromino);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    onSelectedTetromino,
    rotateTetromino,
    switchTetromino,
    selectedTetromino,
  ]);

  const handleTimerEnded = (ended: boolean) => {
    onTimerEnd(ended);
  };

  return (
    <div className="select-tetromino">
      <div className="stage-wrapper">
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => switchTetromino(-1)}
        />
        <div
          className="stage"
          style={{
            '--tetrominoStageHeight': `${TETROMINO_STAGE_HEIGHT}`,
            '--tetrominoStageWidth': `${TETROMINO_STAGE_WIDTH}`,
          }}
        >
          {tetrominoStage.map((row) =>
            row.map((cell, cellIndex) => (
              <TetrominoCell key={cellIndex} tetrominoType={cell[0]} />
            ))
          )}
        </div>
        <FontAwesomeIcon
          icon={faChevronRight}
          onClick={() => {
            switchTetromino(1);
          }}
        />
      </div>
      <div className="timer-container">
        <Timer timerValue={TURN_TIMER} onTimerEnd={handleTimerEnded} />
      </div>
    </div>
  );
}

export default SelectTetromino;
