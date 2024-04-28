import './MultiPlayerGameRoom.scss';
import { useEffect, useState } from 'react';
import {
  CommMessage,
  CommStatus,
  MessageType,
  RETURN_HOME_TIMER,
} from '@constants/game';
import { useWebSocketContext } from '@contexts/WebSocketContext';
import { logInDev } from '@utils/log-utils';
import { useNavigate } from 'react-router-dom';
import wsErrorMessageHandler from '@utils/ws-error-message-handler';
import { Toaster } from 'react-hot-toast';
import SelectTetromino from '@components/SelectTetromino/SelectTetromino';
import { TetrominoShape } from '@customTypes/tetromonoTypes';
import getRandomTetromino from '@utils/get-random-tetromino';

function MultiPlayerGameRoom() {
  let homeTimerId: number = 0;
  const navigate = useNavigate();
  const { isConnectedToServer, gameRoomDetails, errorMessages, sendMessage } =
    useWebSocketContext();
  const [selectedTetromino, setSelectedTetromino] = useState<TetrominoShape>(
    getRandomTetromino().shape
  );
  const [timerEnded, setTimerEnded] = useState<boolean>(false);

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
      logInDev('Game Room Details: ', gameRoomDetails);
    }

    return () => {
      clearTimeout(homeTimerId);
    };
  }, [errorMessages, isConnectedToServer]);

  const returnToHome = () => {
    homeTimerId = setTimeout(() => {
      navigate('/home');
      window.location.reload();
    }, RETURN_HOME_TIMER);
  };

  const handleSelectedTetrmino = (tetromino: TetrominoShape) => {
    setSelectedTetromino(tetromino);
    logInDev(tetromino);
  };

  const handleTimerEnded = (ended: boolean) => {
    setTimerEnded(ended);
  };

  return (
    <div className="multi-player">
      <Toaster />
      <SelectTetromino
        onSelectedTetromino={handleSelectedTetrmino}
        onTimerEnd={handleTimerEnded}
      />
    </div>
  );
}

export default MultiPlayerGameRoom;
