import { RawData, WebSocketServer } from 'ws';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { Server } from 'http';

function handleWebSocketConnections(server: Server) {
  // Websocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    logInDev('New WebSocket connection');

    // WebSocket message handler
    ws.on('message', (message: RawData) => {
      logInDev('Received message:', message.toString());
      // Handle WebSocket message here
      ws.send(`Received your message:  ${message.toString()}`);
    });

    // WebSocket close handler
    ws.on('close', () => {
      logInDev('WebSocket connection closed');
      // Perform cleanup or other tasks
    });

    // WebSocket error handler
    ws.on('error', (error: Error) => {
      logErrorInDev('WebSocket error:', error);
      // Handle WebSocket errors
    });
  });
}

export default handleWebSocketConnections;
