import './MultiPlayerGameRoom.scss';
import { useEffect, useRef, useState } from 'react';
import {
  BASE_DROP_TIME,
  CommMessage,
  CommStatus,
  DROP_TIME_INCR,
  GameMode,
  INITAL_ROWS,
  INITIAL_LEVEL,
  INITIAL_SCORE,
  KEY_CODE_DOWN,
  KEY_CODE_LEFT,
  KEY_CODE_RIGHT,
  KEY_CODE_UP,
  MessageType,
  RETURN_HOME_TIMER,
  TurnState,
} from '@constants/game';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { logInDev } from '@utils/log-utils';
import { useNavigate } from 'react-router-dom';
import wsErrorMessageHandler from '@utils/ws-error-message-handler';
import usePiece from '@hooks/usePiece';
import useStage from '@hooks/useStage';
import useGameStatus from '@hooks/useGameStatus';
import GameArea from '@components/GameArea/GameArea';
import { checkCollision, createStage } from '@utils/game-helpers';
import { KeyCode } from '@customTypes/gameTypes';
import useInterval from '@hooks/useInterval';
import { useMultiplayerGameContext } from '@contexts/MultiplayerGameContext';
import { Toaster } from 'react-hot-toast';

function MultiPlayerGameRoom() {
  let homeTimerId: number = 0;
  const navigate = useNavigate();
  const { isConnectedToServer, gameRoomDetails, errorMessages, sendMessage } =
    useWebSocketContext();
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [turnPaused, setTurnPaused] = useState<boolean>(false);
  const { piece, updatePiecePosition, resetPiece, pieceRotate } = usePiece(
    GameMode.MULTI_PLAYER
  );
  const { stage, setStage, rowsCleared } = useStage(
    piece,
    resetPiece,
    GameMode.MULTI_PLAYER
  );
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
    rowsCleared,
    GameMode.MULTI_PLAYER
  );
  const {
    turn,
    userSelectedTetromino,
    // setInitialPlayerInfo,
    handleTurnStateChange,
    playerInfo,
  } = useMultiplayerGameContext();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Send a message when inside game room
    // wsCommStatusCheck(messages, PLAYER_ONE) ===
    // CommStatusCheck.PLAYER_ONE_IS_CONNECTED

    if (!isConnectedToServer) {
      wsErrorMessageHandler(errorMessages, returnToHome);
    }

    if (gameRoomDetails !== null) {
      sendMessage({
        messageType: MessageType.COMM_MESSAGE,
        messageName: CommMessage.JOINED_GAME_ROOM,
        isConnectedToServer: true,
        messageBody: `Joined game room: ${gameRoomDetails.roomId}`,
        player: gameRoomDetails.player,
        commStatus: CommStatus.IN_GAME_ROOM,
      });
      // Set initial playerInfo before game begins
      // setInitialPlayerInfo({
      //   playerName: gameRoomDetails.player,
      //   turnsRemaining: MAX_TURNS,
      //   penalties: INIITAL_PENALTIES,
      //   score: INITIAL_SCORE,
      // });
      logInDev('Game Room Details: ', gameRoomDetails);
    }

    return () => {
      clearTimeout(homeTimerId);
    };
  }, [errorMessages, isConnectedToServer]);

  const returnToHome = () => {
    homeTimerId = Number(
      setTimeout(() => {
        navigate('/home');
        window.location.reload();
      }, RETURN_HOME_TIMER)
    );
  };

  // Move the piece if no collision occurs
  const movePiece = (direction: number) => {
    const didCollide = checkCollision(piece, stage, { x: direction, y: 0 });
    if (!didCollide) {
      updatePiecePosition({ x: direction, y: 0, collided: didCollide });
    }
  };

  // Starts the game or resets the game when game over
  const startGame = () => {
    setStage(createStage());
    setDropTime(BASE_DROP_TIME);
    // resetPiece(null);
    setGameOver(false);
    setScore(INITIAL_SCORE);
    setRows(INITAL_ROWS);
    setLevel(INITIAL_LEVEL);
    // setGameStarted(true);
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  useEffect(() => {
    if (turn.currentState === TurnState.PLAY_TURN) {
      startGame();
    }
  }, []);

  // Logic to drop the tetromino
  const drop = () => {
    if (!gameOver && !turnPaused) {
      // Increase level when piece has cleared 10 rows
      if (rows > (level + 1) * 10) {
        setLevel((prev) => prev + 1);
        // Increase speed of tetromino fall
        setDropTime(1000 / (level + 1) + DROP_TIME_INCR);
      }

      if (!checkCollision(piece, stage, { x: 0, y: 1 })) {
        updatePiecePosition({ x: 0, y: 1, collided: false });
      } else {
        // Game over when collision occurs at the top
        if (piece.position.y < 1 || playerInfo.turnsRemaining === 0) {
          setGameOver(true);
          // setGameStarted(false);
          setDropTime(null);
        } else {
          // Else the tetromino collided with the stage boundary
          // or/and other tetromino
          updatePiecePosition({ x: 0, y: 0, collided: true });
          if (turn.currentState === TurnState.PLAY_TURN) {
            handleTurnStateChange(TurnState.UPDATE_PLAYER_INFO);
          }
        }
      }
    }
  };

  const dropPiece = () => {
    drop();
  };

  // Processes key strokes from the key board
  const move = ({ keyCode }: KeyCode) => {
    if (!gameOver && !turnPaused) {
      if (keyCode === KEY_CODE_LEFT) {
        // Left arrow
        // Moves the piece to the left on x-axis
        movePiece(-1);
      } else if (keyCode === KEY_CODE_RIGHT) {
        // Right arrow
        // Moves the piece to the right on x-axis
        movePiece(1);
      } else if (keyCode === KEY_CODE_DOWN) {
        // Down arrow
        dropPiece();
      } else if (keyCode === KEY_CODE_UP) {
        // Up arrow
        pieceRotate(stage, 1);
      }
    }
  };

  // Rotates the tetromino
  const keyUp = ({ keyCode }: KeyCode) => {
    if (!gameOver && !turnPaused) {
      if (keyCode === KEY_CODE_DOWN) {
        setDropTime(BASE_DROP_TIME / (level + 1) + DROP_TIME_INCR);
      }
    }
  };

  // Drops the tetromino at intervals dropTime
  useInterval(() => {
    drop();
  }, dropTime!);

  // Pauses the turn
  const pauseTurn = () => {
    logInDev('paused turn');
    // resetPiece(null);
    setTurnPaused(true);
    setDropTime(null);
    handleTurnStateChange(TurnState.SELECT_TETROMINO);
  };

  // Resumes the turn
  const resumeTurn = () => {
    logInDev('resumed turn');
    resetPiece(userSelectedTetromino);
    setTurnPaused(false);
    if (turn.penaltyIncurred) {
      setDropTime(BASE_DROP_TIME / (playerInfo.penalties + 5) + DROP_TIME_INCR);
      logInDev('penalties: ', playerInfo.penalties);
    } else {
      setDropTime(BASE_DROP_TIME / level);
    }
    dropPiece();

    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  useEffect(() => {
    if (turn.currentState === TurnState.PLAY_TURN) {
      resumeTurn();
    } else if (turn.currentState === TurnState.END_TURN) {
      pauseTurn();
    }
  }, [turn.currentState]);

  return (
    <div className="multi-player">
      <Toaster
        toastOptions={{
          style: {
            fontSize: '0.7vw',
          },
          success: {
            iconTheme: {
              primary: 'black',
              secondary: 'rgb(201, 206, 214)',
            },
          },
          error: {
            iconTheme: {
              primary: 'black',
              secondary: 'rgb(173, 175, 179)',
            },
          },
        }}
      />
      <div
        role="button"
        className="game-area-wrapper"
        onKeyDown={(e) => move(e)}
        onKeyUp={keyUp}
        ref={gameAreaRef}
        tabIndex={0}
      >
        <GameArea
          stage={stage}
          currentLevel={level}
          gameOver={gameOver}
          gameScore={score}
          rows={rows}
          isMultiplayer
        />
      </div>
    </div>
  );
}

export default MultiPlayerGameRoom;
