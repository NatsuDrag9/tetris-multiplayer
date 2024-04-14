import { RawData, WebSocketServer } from 'ws';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { Server } from 'http';
import { GameCommMode } from '@src/constants/appConstants';

function handleWebSocketConnections(server: Server) {
  // Websocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    logInDev('New WebSocket connection');

    // WebSocket message handler
    ws.on('message', (message: RawData) => {
      logInDev('Received message:', message.toString());

      // ws.send(`${message.toString()}`);

      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === GameCommMode.CODE) {
          // Broadcast the message to all connected clients except the sender
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: GameCommMode.ENTER_CODE,
                  body: parsedMessage.body,
                })
              );
            }
          });
        } else if (parsedMessage.type === GameCommMode.JOIN_GAME_ROOM) {
          // Broadcast the message to all connected clients except the sender
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: GameCommMode.JOIN_GAME_ROOM,
                  body: parsedMessage.body,
                })
              );
            }
          });
        }
      } catch (error) {
        logErrorInDev('Error parsing WebSocket message:', error);
      }
    });

    // WebSocket close handler
    ws.on('close', () => {
      logInDev('WebSocket connection closed');
    });

    // WebSocket error handler
    ws.on('error', (error: Error) => {
      logErrorInDev('WebSocket error:', error);
    });
  });
}

export default handleWebSocketConnections;
