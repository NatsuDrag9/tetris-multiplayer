import dotenv from 'dotenv';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import WebSocket from 'ws';
import { Server } from 'http';
import app from './app';

// Determine the environment
const environment = process.env.NODE_ENV || 'development';

// Load the corresponding .env file
dotenv.config({ path: `.env.${environment}` });

logInDev('Logging current environment: ', process.env.NODE_ENV);

// HTTP Server
const PORT = process.env.PORT || 3000;

const httpServer: Server = app.listen(PORT, () => {
  logInDev(`Server is running on port ${PORT}`);
});

// Websocket Server
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws) => {
  logInDev('New WebSocket connection');

  // WebSocket message handler
  ws.on('message', (message) => {
    logInDev('Received message:', message.toString());
    // Handle WebSocket message here
  });

  // WebSocket close handler
  ws.on('close', () => {
    logInDev('WebSocket connection closed');
    // Perform cleanup or other tasks
  });

  // WebSocket error handler
  ws.on('error', (error) => {
    logErrorInDev('WebSocket error:', error);
    // Handle WebSocket errors
  });
});
