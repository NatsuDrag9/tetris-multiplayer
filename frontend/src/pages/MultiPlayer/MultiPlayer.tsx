import GameRoom from '@components/GameRoom/GameRoom';
import './MultiPlayer.scss';
import useWebSocket from '@hooks/useWebSocket';
import { useEffect } from 'react';
import wsCommStatusCheck from '@utils/wsCommStatusCheck';
import {
  CommStatus,
  CommStatusCheck,
  MessageType,
  PLAYER_ONE,
} from '@constants/game';
import useGameRoom from '@hooks/useGameRoom';

function MultiPlayer() {
  const { messages, sendMessage } = useWebSocket();
  const { gameRoomDetails } = useGameRoom();

  useEffect(() => {
    // Send a message when inside game room
    if (
      wsCommStatusCheck(messages, PLAYER_ONE) ===
      CommStatusCheck.PLAYER_ONE_IS_CONNECTED
    ) {
      if (gameRoomDetails !== null) {
        sendMessage({
          messageType: MessageType.JOINED_GAME_ROOM,
          isConnectedToServer: true,
          messageBody: `Joined game room: ${gameRoomDetails.roomId}`,
          player: gameRoomDetails.player,
          commStatus: CommStatus.IN_GAME_ROOM,
        });
      }
    }
  }, []);
  return (
    <div className="multi-player">
      <GameRoom />
    </div>
  );
}

export default MultiPlayer;
