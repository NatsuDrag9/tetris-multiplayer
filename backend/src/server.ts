import dotenv from 'dotenv';
import { logInDev } from '@utils/log-utils';
import { Server } from 'http';
import app from './app';
import handleWebSocketConnections from './webSocket/webSocketServer';
import serverMiddlewares from './middlewares/serverMiddlewares';

// Determine the environment
const environment = process.env.NODE_ENV || 'development';

// Load the corresponding .env file
dotenv.config({ path: `.env.${environment}` });

logInDev('Logging current environment: ', process.env.NODE_ENV);

// Apply Middlewares
serverMiddlewares(app);

// HTTP Server
const PORT = process.env.PORT || 3000;

const httpServer: Server = app.listen(PORT, () => {
  logInDev(`HTTP Server is running on port ${PORT}`);
});

handleWebSocketConnections(httpServer);
