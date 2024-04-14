import { WebSocketMessage } from '@customTypes/webSocketTypes';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { useState, useEffect } from 'react';

function useWebSocket() {
  const serverUrl = import.meta.env.VITE_WEB_SOCKET_URL;
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const onOpen = () => {
    logInDev('Connected to WebSocket server');
  };

  const onMessage = (event: MessageEvent) => {
    try {
      const newMessage: WebSocketMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  const onError = (error: Event) => {
    logErrorInDev('WebSocket error:', error);
  };

  useEffect(() => {
    const socket = new WebSocket(serverUrl);
    setWs(socket);

    socket.onopen = onOpen;
    socket.onmessage = onMessage;
    socket.onerror = onError;

    // Clean-up function to close the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [serverUrl]);

  const sendMessage = (message: WebSocketMessage) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // ws.send(message.body);
      ws.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
}

export default useWebSocket;
