import { useWebSocketContext } from '@contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import MultiplayerLobby from '@pages/MultiplayerLobby/MultiplayerLobby';
import toast from 'react-hot-toast';
import { MultiplayerGameProvider } from '@contexts/MultiplayerGameContext';
import MultiPlayerGameRoom from '@pages/MultiPlayerGameRoom/MultiPlayerGameRoom';

export const ProtectedMultiplayerLobby = () => {
  const { clientId } = useWebSocketContext();
  const navigate = useNavigate();

  // Redirect to home if clientId doesn't exist
  if (!clientId) {
    toast.error('Client ID not found. Redirecting to home page...');
    navigate('/home');
    return null;
  }

  return <MultiplayerLobby />;
};

export const ProtectedMultiplayerGameRoom = () => {
  const { gameRoomDetails } = useWebSocketContext();
  const navigate = useNavigate();

  // Redirect to lobby if gameRoomDetails are not available
  if (
    !gameRoomDetails ||
    !gameRoomDetails.gameRoomCode ||
    !gameRoomDetails.roomId
  ) {
    toast.error(
      'Game room details not found. Redirecting to multiplayer lobby...'
    );
    navigate('/multiplayer-lobby');
    return null;
  }

  return (
    <MultiplayerGameProvider>
      <MultiPlayerGameRoom />
    </MultiplayerGameProvider>
  );
};
