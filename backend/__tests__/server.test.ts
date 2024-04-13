// import dotenv from 'dotenv';
import supertest from 'supertest';
import app from '../src/app';
import handleWebSocketConnections from '../src/webSocket/webSocketServer';
import { Server } from 'http';
import { logInTest } from '../src/utils/log-utils';
import { beforeAll, describe, it, expect, afterAll } from '@jest/globals';
import WebSocket from 'ws';

// // Determine the environment
// const environment = process.env.NODE_ENV;

// // Load the corresponding .env file
// dotenv.config({ path: `.env.${environment}` });

// logInTest('Logging current environment: ', process.env.NODE_ENV);

let server: Server;
let webSocketServer: WebSocket.Server;
let TEST_PORT = 3001;

describe('HTTP Server hello world test suite', () => {
  beforeAll(
    () =>
      new Promise<void>((resolve, reject) => {
        logInTest('Before all... ');
        server = app
          .listen(TEST_PORT, () => {
            logInTest(`Server started and listening on ${TEST_PORT}`);
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
      })
  );

  it('should respond with 200 status code for GET / endpoint', async () => {
    try {
      const response = await supertest(app).get('/');
      expect(response.status).toBe(200);
    } catch (error) {
      expect(error).toBe(error);
    }
  });

  afterAll((done) => {
    server.close(() => {
      logInTest('Server closed after testing.');
      done();
    });
  });
});

describe('WebSocket server hello world test suite', () => {
  beforeAll((done) => {
    logInTest('Before all... ');

    // Start the HTTP server
    server = app
      .listen(TEST_PORT, () => {
        logInTest(`HTTP Server started and listening on ${TEST_PORT}`);

        handleWebSocketConnections(server);

        // // Start the WebSocket server
        // webSocketServer = new WebSocket.Server({ server });

        // webSocketServer.on('connection', (ws) => {
        //   logInTest('WebSocket connection established.');

        //   // Handle WebSocket messages
        //   ws.on('message', (message) => {
        //     logInTest('Received WebSocket message (in buffer):', message);
        //     logInTest(
        //       'Received WebSocket message (in string):',
        //       message.toString()
        //     );
        //     ws.send('Test message from server');
        //   });
        // });

        done();
      })
      .on('error', (err) => {
        throw err;
      });
  });

  it('should send and receive WebSocket messages', (done) => {
    // Create a websocket client to connect to the websocket server
    const webSocketClient = new WebSocket(`ws://localhost:${TEST_PORT}`);

    webSocketClient.on('open', () => {
      logInTest('WebSocket client connected');

      // Send a test message to the WebSocket server
      webSocketClient.send('Test message from client');
    });

    // Listen for messages from the WebSocket server
    webSocketClient.on('message', (message) => {
      logInTest('Message from WebSocket server (in buffer):', message);
      logInTest(
        'Message from WebSocket server (in string):',
        message.toString()
      );

      // Verify that the message received matches the expected message
      expect(message.toString()).toBe(`${message.toString()}`);

      // Close the WebSocket connection after the test is complete
      webSocketClient.close();
      done();
    });
  });

  afterAll((done) => {
    // Close the HTTP server
    server.close(() => {
      logInTest('HTTP server closed after testing.');
      done();
    });
  });
});
