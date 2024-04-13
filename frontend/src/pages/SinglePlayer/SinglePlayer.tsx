import GameArea from '@components/GameArea/GameArea';
import './SinglePlayer.scss';
import { useEffect, useState } from 'react';
import usePlayer from '@hooks/usePlayer';
import getRandomTetromino from '@utils/getRandomTetromino';
import useStage from '@hooks/useStage';
import useGameStatus from '@hooks/useGameStatus';
import { checkCollision, createStage } from '@utils/gameHelpers';
import {
  BASE_DROP_TIME,
  DROP_TIME_INCR,
  INITAL_ROWS,
  INITIAL_LEVEL,
  INITIAL_SCORE,
  KEY_CODE_DOWN,
  KEY_CODE_LEFT,
  KEY_CODE_RIGHT,
  KEY_CODE_UP,
} from '@constants/game';
import useInterval from '@hooks/useInterval';
import { KeyCode } from '@customTypes/gameTypes';

function SinglePlayer() {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gamePaused, setGamePaused] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const { player, updatePlayerPosition, resetPlayer, playerRotate } = usePlayer(
    getRandomTetromino().shape
  );
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } =
    useGameStatus(rowsCleared);

  // Move the player if no collision occurs
  const movePlayer = (direction: number) => {
    const didCollide = checkCollision(player, stage, { x: direction, y: 0 });
    if (!didCollide) {
      updatePlayerPosition({ x: direction, y: 0, collided: didCollide });
    }
  };

  // Starts the game or resets the game when game over
  const startGame = () => {
    setStage(createStage());
    setDropTime(BASE_DROP_TIME);
    resetPlayer();
    setGameOver(false);
    setScore(INITIAL_SCORE);
    setRows(INITAL_ROWS);
    setLevel(INITIAL_LEVEL);
    setGameStarted(true);
  };

  // Pauses the game
  const pauseGame = () => {
    setGamePaused(true);
    setDropTime(null);
  };

  // Resumes the game
  const resumeGame = () => {
    setGamePaused(false);
    setDropTime(BASE_DROP_TIME / (level + 1) + DROP_TIME_INCR);
  };

  // Logic to drop the tetromino
  const drop = () => {
    if (!gameOver && !gamePaused) {
      // Increase level when player has cleared 10 rows
      if (rows > (level + 1) * 10) {
        setLevel((prev) => prev + 1);
        // Increase speed of tetromino fall
        setDropTime(1000 / (level + 1) + DROP_TIME_INCR);
      }

      if (!checkCollision(player, stage, { x: 0, y: 1 })) {
        updatePlayerPosition({ x: 0, y: 1, collided: false });
      } else {
        // Game over when collision occurs at the top
        if (player.position.y < 1) {
          setGameOver(true);
          setGameStarted(false);
          setDropTime(null);
        } else {
          // Else the tetromino collided with the stage bounday
          // or/and other tetromino
          updatePlayerPosition({ x: 0, y: 0, collided: true });
        }
      }
    }
  };

  const dropPlayer = () => {
    drop();
  };

  // Processes key strokes from the key board
  const move = ({ keyCode }: KeyCode) => {
    if (!gameOver && !gamePaused) {
      if (keyCode === KEY_CODE_LEFT) {
        // Left arrow
        // Moves the player to the left on x-axis
        movePlayer(-1);
      } else if (keyCode === KEY_CODE_RIGHT) {
        // Right arrow
        // Moves the player to the right on x-axis
        movePlayer(1);
      } else if (keyCode === KEY_CODE_DOWN) {
        // Down arrow
        dropPlayer();
      } else if (keyCode === KEY_CODE_UP) {
        // Up arrow
        playerRotate(stage, 1);
      }
    }
  };

  // Rotates the tetromino
  const keyUp = ({ keyCode }: KeyCode) => {
    if (!gameOver && !gamePaused) {
      if (keyCode === KEY_CODE_DOWN) {
        setDropTime(BASE_DROP_TIME / (level + 1) + DROP_TIME_INCR);
      }
    }
  };

  // Drops the tetromino at intervals dropTime
  useInterval(() => {
    drop();
  }, dropTime!);

  // Event listener for pause/resume
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!gameOver) {
          if (gamePaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gamePaused, gameOver]);

  const getHandlerFunction = () => {
    if (!gameStarted || gameOver) {
      return startGame;
    }
    return gamePaused ? resumeGame : pauseGame;
  };

  return (
    <div className="single-player">
      <div
        role="button"
        className="game-area-wrapper"
        onKeyDown={(e) => move(e)}
        onKeyUp={keyUp}
      >
        <GameArea
          stage={stage}
          currentLevel={level}
          gameOver={gameOver}
          gameScore={score}
          rows={rows}
          onButtonClick={getHandlerFunction()}
          gameStarted={gameStarted}
          gamePaused={gamePaused}
        />
      </div>
    </div>
  );
}

export default SinglePlayer;
