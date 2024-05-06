import './SelectTetromino.scss';
import { useEffect, useState } from 'react';
import TetrominoCell from '@components/TetrominoCell/TetrominoCell';
import useTetrominoStage from '@hooks/useTetrominoStage';
import {
  TETROMINO_STAGE_HEIGHT,
  TETROMINO_STAGE_WIDTH,
  TURN_TIMER,
} from '@constants/game';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import GameButton from '@components/GameButton/GameButton';
import { useMultiplayerGameContext } from '@contexts/MultiplayerGameContext';
import getRandomTetromino from '@utils/get-random-tetromino';
import formatTime from '@utils/date-time-utils';

function SelectTetromino() {
  const {
    tetrominoStage,
    switchTetromino,
    rotateTetromino,
    selectedTetromino,
    addNewTetrominoToStage,
  } = useTetrominoStage();
  const {
    setUserSelectedTetromino,
    turnTask,
    updateStartTimer,
    updateStopTimer,
  } = useMultiplayerGameContext();
  const [tetrominoSelected, setTetrmonioSelected] = useState<boolean>(false);
  const [timer, setTimer] = useState(TURN_TIMER);
  const [timerEnded, setTimerEnded] = useState<boolean>(false);

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
          // onSelectedTetromino(selectedTetromino);
          handleButtonClick();
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
    // onSelectedTetromino,
    rotateTetromino,
    switchTetromino,
    selectedTetromino,
  ]);

  useEffect(() => {
    if (timerEnded && !tetrominoSelected) {
      setUserSelectedTetromino(getRandomTetromino().shape);
      setTetrmonioSelected(false);
      updateStartTimer(false);
    }
  }, [timerEnded, tetrominoSelected]);

  useEffect(() => {
    if (!tetrominoSelected && turnTask.startTimer) {
      const timerId = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(timerId);
            setTimerEnded(true);
            updateStopTimer(true);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [tetrominoSelected]);

  useEffect(() => {
    if (tetrominoSelected && !turnTask.startTimer) {
      setTimer(0);
      setTetrmonioSelected(false);
    }
  }, [turnTask.startTimer, tetrominoSelected]);

  const handleButtonClick = () => {
    setTetrmonioSelected(true);
    setUserSelectedTetromino(selectedTetromino);
    setTimer(0);
    updateStartTimer(false);
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
        <h3 className="timer">{formatTime(timer)}</h3>
      </div>
      <GameButton
        buttonText={'Use Tetromino'}
        onButtonClick={handleButtonClick}
      />
    </div>
  );
}

export default SelectTetromino;
