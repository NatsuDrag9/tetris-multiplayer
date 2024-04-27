import GameRoom from '@components/GameRoom/GameRoom';
import './MultiPlayerGameRoom.scss';
import { useEffect } from 'react';
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

function MultiPlayerGameRoom() {
  let homeTimerId: number = 0;
  const navigate = useNavigate();
  const { isConnectedToServer, gameRoomDetails, errorMessages, sendMessage } =
    useWebSocketContext();

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
    }, RETURN_HOME_TIMER);
  };

  return (
    <div className="multi-player">
      <Toaster />
      <GameRoom />
    </div>
  );
}

export default MultiPlayerGameRoom;
