import './SelectTetromino.scss';
import { useEffect, useRef, useState } from 'react';
import TetrominoCell from '@components/TetrominoCell/TetrominoCell';
import useTetrominoStage from '@hooks/useTetrominoStage';
import {
  TETROMINO_STAGE_HEIGHT,
  TETROMINO_STAGE_WIDTH,
  TURN_TIMER,
  TurnState,
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
    turn,
    handleTurnStateChange,
    updatePenaltyIncurred,
  } = useMultiplayerGameContext();
  const [tetrominoSelected, setTetrmonioSelected] = useState<boolean>(false);
  const [timer, setTimer] = useState(10);
  const [timerEnded, setTimerEnded] = useState<boolean>(false);
  const selectTetrominoRef = useRef<HTMLDivElement>(null);
  let timerId: number;

  useEffect(() => {
    addNewTetrominoToStage();
    if (selectTetrominoRef.current) {
      selectTetrominoRef.current.focus();
    }
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

    if (turn.currentState === TurnState.SELECT_TETROMINO) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (turn.currentState === TurnState.SELECT_TETROMINO) {
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [
    // onSelectedTetromino,
    rotateTetromino,
    switchTetromino,
    selectedTetromino,
  ]);

  useEffect(() => {
    if (turn.currentState === TurnState.SELECT_TETROMINO) {
      timerId = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerId);
            setTimerEnded(true);
            handleTurnStateChange(TurnState.PLAY_TURN);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);

      if (tetrominoSelected && !timerEnded) {
        setTetrmonioSelected(false);
        updatePenaltyIncurred(false);
        setTetrmonioSelected(false);
      } else if (!tetrominoSelected && timerEnded) {
        setUserSelectedTetromino(getRandomTetromino().shape);
        updatePenaltyIncurred(true);
        setTetrmonioSelected(false);
      }

      return () => {
        clearInterval(timerId);
        setTimer(10);
      };
    }
  }, [tetrominoSelected, turn.currentState]);

  const handleButtonClick = () => {
    setTetrmonioSelected(true);
    setUserSelectedTetromino(selectedTetromino);
    handleTurnStateChange(TurnState.PLAY_TURN);
    clearInterval(timerId);
    setTimer(10);
  };

  return (
    <div className="select-tetromino" ref={selectTetrominoRef}>
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
