import dotenv from 'dotenv';
import { logInDev } from '@utils/log-utils';
import { Server } from 'http';
import app from './app';
import handleWebSocketConnections from './webSocket/webSocketServer';
import dbApp from './dbApp';

// Determine the environment
const environment = process.env.NODE_ENV || 'development';

// Load the corresponding .env file
dotenv.config({ path: `.env.${environment}` });

logInDev('Logging current environment: ', process.env.NODE_ENV);

// DB Server
const DB_PORT = process.env.DB_PORT || 5000;
dbApp.listen(DB_PORT, () => {
  logInDev(`DB Server is running on port ${DB_PORT}`);
});

// HTTP Server for websockets
const PORT = process.env.PORT || 3000;
const httpServer: Server = app.listen(PORT, () => {
  logInDev(`HTTP Server is running on port ${PORT}`);
});

handleWebSocketConnections(httpServer);
