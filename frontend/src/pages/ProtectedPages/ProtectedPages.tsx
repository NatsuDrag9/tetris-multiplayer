import { useWebSocketContext } from '@contexts/WebSocketContext';
import MultiplayerLobby from '@pages/MultiplayerLobby/MultiplayerLobby';
import toast, { Toaster } from 'react-hot-toast';
import { MultiplayerGameProvider } from '@contexts/MultiplayerGameContext';
import MultiPlayerGameRoom from '@pages/MultiPlayerGameRoom/MultiPlayerGameRoom';
import useReturnTo from '@hooks/useReturnTo';
import { useEffect } from 'react';
import toastOptions from '@constants/misc';

export const ProtectedMultiplayerLobby = () => {
  const { clientId } = useWebSocketContext();
  const returnToHome = useReturnTo('home');

  useEffect(() => {
    // Function to handle the redirection with a delay after showing a toast
    const handleRedirect = async () => {
      if (!clientId) {
        await toast.error('Client ID not found. Redirecting to home page...', {
          duration: 3000,
        });
        returnToHome();
      }
    };

    handleRedirect();
  }, [clientId]);

  if (!clientId) {
    return (
      <>
        <Toaster toastOptions={toastOptions} />
      </>
    );
  }

  return <MultiplayerLobby />;
};

export const ProtectedMultiplayerGameRoom = () => {
  const { gameRoomDetails } = useWebSocketContext();
  const returnToLobby = useReturnTo('multiplayer-lobby');

  useEffect(() => {
    // Function to handle the redirection with a delay after showing a toast
    const handleRedirect = async () => {
      if (
        !gameRoomDetails ||
        !gameRoomDetails.gameRoomCode ||
        !gameRoomDetails.roomId
      ) {
        await toast.error(
          'Game room details not found. Redirecting to multiplayer lobby...',
          {
            duration: 3000, // Duration in milliseconds for how long to show the toast
          }
        );
        returnToLobby();
      }
    };

    handleRedirect();
  }, [gameRoomDetails, returnToLobby]);

  if (
    !gameRoomDetails ||
    !gameRoomDetails.gameRoomCode ||
    !gameRoomDetails.roomId
  ) {
    return (
      <>
        <Toaster toastOptions={toastOptions} />
      </>
    );
  }

  return (
    <MultiplayerGameProvider>
      <MultiPlayerGameRoom />
    </MultiplayerGameProvider>
  );
};
