import "./SelectTetromino.scss";
import { CSSProperties, useEffect, useRef, useState } from "react";
import TetrominoCell from "@components/TetrominoCell/TetrominoCell";
import useTetrominoStage from "@hooks/useTetrominoStage";
import {
  TETROMINO_STAGE_HEIGHT,
  TETROMINO_STAGE_WIDTH,
  TURN_TIMER,
  TurnState,
} from "@constants/game";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import GameButton from "@components/GameButton/GameButton";
import { useMultiplayerGameContext } from "@contexts/MultiplayerGameContext";
import getRandomTetromino from "@utils/get-random-tetromino";
import formatTime from "@utils/date-time-utils";
import { logInDev } from "@utils/log-utils";

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
  const [timer, setTimer] = useState(TURN_TIMER);
  const [timerEnded, setTimerEnded] = useState<boolean>(false);
  const selectTetrominoRef = useRef<HTMLDivElement>(null);
  let timerId: number;

  useEffect(() => {
    addNewTetrominoToStage();
    if (selectTetrominoRef.current) {
      selectTetrominoRef.current.focus();
    }
    // Disabled rule as no dependency is required here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          switchTetromino(-1);
          break;
        case "ArrowRight":
          switchTetromino(1);
          break;
        case "ArrowUp":
          rotateTetromino();
          break;
        case "Enter":
          handleButtonClick();
          break;
        default:
          break;
      }
    };

    if (turn.currentState === TurnState.SELECT_TETROMINO) {
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (turn.currentState === TurnState.SELECT_TETROMINO) {
        document.removeEventListener("keydown", handleKeyPress);
      }
    };
    // Disabled rule as no additional dependencies are required here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotateTetromino, switchTetromino, selectedTetromino]);

  const handleTimerExpiration = () => {
    setTimerEnded(true);
    if (!tetrominoSelected) {
      logInDev("Time expired: selecting random tetromino");
      setUserSelectedTetromino(getRandomTetromino().shape);
      updatePenaltyIncurred(true);
    }
    handleTurnStateChange(TurnState.PLAY_TURN);
  };

  useEffect(() => {
    if (turn.currentState === TurnState.SELECT_TETROMINO) {
      // Disabled rule as the quick-fix was suggesting to place the entire
      // timerId code block into a separate usEffect. Not sure why is ESLint
      // complaining here
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timerId = Number(
        setInterval(() => {
          setTimer((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timerId);
              handleTimerExpiration();
              return 0;
            } else {
              return prevTime - 1;
            }
          });
        }, 1000)
      );

      return () => {
        clearInterval(timerId);
        setTimer(TURN_TIMER);
      };
    }
  }, [tetrominoSelected, turn.currentState]);

  const handleButtonClick = () => {
    setTetrmonioSelected(true);
    setUserSelectedTetromino(selectedTetromino);
    handleTurnStateChange(TurnState.PLAY_TURN);
    clearInterval(timerId);
    setTimer(TURN_TIMER);
  };

  const customStyle = {
    "--tetrominoStageHeight": `${TETROMINO_STAGE_HEIGHT}`,
    "--tetrominoStageWidth": `${TETROMINO_STAGE_WIDTH}`,
  } as CSSProperties;

  return (
    <div className="select-tetromino" ref={selectTetrominoRef}>
      <div className="stage-wrapper">
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => switchTetromino(-1)}
        />
        <div className="stage" style={customStyle}>
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
        buttonText={"Use Tetromino"}
        onButtonClick={handleButtonClick}
        buttonTestId="use-tetromino"
      />
    </div>
  );
}

export default SelectTetromino;
