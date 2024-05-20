import { GameMessage, MessageType } from '@constants/game';
import { GameRoomDetails, WebSocketMessage } from '@customTypes/gameTypes';
import getNumberAfterColon from '@utils/get-number-after-colon';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface WebSocketContextValue {
  isConnectedToServer: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  commMessages: WebSocketMessage[];
  errorMessages: WebSocketMessage[];
  gameMessages: WebSocketMessage[];
  setCurrentPlayer: (playerName: string) => void;
  gameRoomDetails: GameRoomDetails | null;
  getWinner: () => string;
  updateGameRoomDetails: (messageBody: string, code: string) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const useWebSocketContext = (): WebSocketContextValue => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider'
    );
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [commMessages, setCommMessages] = useState([] as WebSocketMessage[]);
  const [errorMessages, setErrorMessages] = useState([] as WebSocketMessage[]);
  const [gameMessages, setGameMessages] = useState([] as WebSocketMessage[]);
  const [isConnectedToServer, setIsConnectedToServer] =
    useState<boolean>(false);
  const [gameRoomDetails, setGameRoomDetails] =
    useState<GameRoomDetails | null>(null);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_WEB_SOCKET_URL;
    const newSocket = new WebSocket(serverUrl);

    newSocket.onopen = () => {
      setIsConnectedToServer(true);
      logInDev('Connected to WebSocket server');
    };

    newSocket.onmessage = (event) => {
      try {
        const newMessage: WebSocketMessage = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (newMessage.messageType === MessageType.COMM_MESSAGE) {
          setCommMessages((prevMessages) => [...prevMessages, newMessage]);
        } else if (newMessage.messageType === MessageType.GAME_MESSAGE) {
          setGameMessages((prevMessages) => [...prevMessages, newMessage]);
        } else if (newMessage.messageType === MessageType.ERROR_MESSAGE) {
          setErrorMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        logErrorInDev('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onerror = (error) => {
      logErrorInDev('WebSocket error:', error);
    };

    setSocket(newSocket);

    return () => {
      handleDisconnect();
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    errorMessages.forEach((errorMessage) => {
      if (!errorMessage.isConnectedToServer) {
        handleDisconnect();
      }
    });
  }, [errorMessages]);

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const setCurrentPlayer = (playerName: string) => {
    setGameRoomDetails({
      roomId: 0,
      entryCode: '',
      player: playerName,
    });
  };

  const handleDisconnect = () => {
    setIsConnectedToServer(false);
  };

  const getWinner = (): string => {
    const index = gameMessages.findIndex(
      (message) => message.messageName === GameMessage.WINNER
    );
    // Body of this message type contains winner name
    return index !== -1 ? gameMessages[index].messageBody : 'Please wait...';
  };

  const updateGameRoomDetails = (messageBody: string, code: string) => {
    const roomId = getNumberAfterColon(messageBody);
    if (roomId === null) {
      logErrorInDev('Room id is null. Check Server.', roomId);
      return;
    }
    setGameRoomDetails((prevValue: GameRoomDetails | null) => ({
      roomId: roomId,
      entryCode: code,
      player: prevValue !== null ? prevValue.player : '',
    }));
  };

  const contextValue: WebSocketContextValue = {
    isConnectedToServer,
    sendMessage,
    errorMessages,
    commMessages,
    gameMessages,
    gameRoomDetails,
    updateGameRoomDetails,
    setCurrentPlayer,
    getWinner,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
