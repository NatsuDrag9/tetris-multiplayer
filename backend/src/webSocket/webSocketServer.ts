import { RawData, WebSocketServer, WebSocket } from 'ws';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { Server } from 'http';
// import { GameCommMode } from '@src/constants/appConstants';
import {
  GameRoom,
  LobbyMember,
  WebSocketMessage,
} from '@src/customTypes/customTypes';
import {
  CommStatus,
  MAX_GAME_ROOMS,
  MAX_TURNS,
  MessageType,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@src/constants/appConstants';

// Counter to uniquely identify each client
let clientIdCounter: number = 0;

// Assigns a unique room id to each gameRoom object
let gameRoomIdCounter: number = 1;

// Array to store game rooms
const availableGameRooms: GameRoom[] = [];
const allPlayerOnes: LobbyMember[] = [];
const allPlayerTwos: LobbyMember[] = [];

function handleIncomingMessage(
  message: WebSocketMessage,
  ws: WebSocket,
  wss: WebSocketServer,
  clientId: number
) {
  if (message.commStatus === CommStatus.IN_LOBBY) {
    // All communication when
    switch (message.messageType) {
      case MessageType.BROADCAST_CODE:
        // Add new PLAYER_ONE to the list
        logInDev(message.messageBody);
        if (message.player === PLAYER_ONE) {
          allPlayerOnes.push({
            wsClient: ws,
            code: message.messageBody,
            clientId,
          });
        }

        // Broadcast the message to all clients except the sender
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(message));
          }
        });
        break;
      case MessageType.WAITING_FOR_CODE:
        // Add new PLAYER_TWO to the list and keep the code field empty
        if (message.player === PLAYER_TWO) {
          allPlayerTwos.push({
            wsClient: ws,
            code: '',
            clientId,
          });
        }
        break;
      case MessageType.READY_TO_JOIN_GAME_ROOM:
        // Set the code of this player two. This message type is only sent by PLAYER_TWO
        const currentPlayerTwo = allPlayerTwos.find(
          (playerTwo) => playerTwo.wsClient === ws
        );
        if (currentPlayerTwo) {
          currentPlayerTwo.code = message.messageBody;
        }

        // Find PLAYER_ONE whose code matches the code entered by this PLAYER_TWO
        const matchedPlayerOne = allPlayerOnes.find(
          (playerOne) => playerOne.code === message.messageBody
        );
        // Check if game rooms are available
        if (availableGameRooms.length < MAX_GAME_ROOMS) {
          if (matchedPlayerOne) {
            // Create GameRoom object and push
            const gameRoom: GameRoom = {
              playerOneInfo: {
                penalties: 0,
                playerName: PLAYER_ONE,
                score: 0,
                turnsRemaining: MAX_TURNS,
              },
              playerTwoInfo: {
                penalties: 0,
                playerName: PLAYER_ONE,
                score: 0,
                turnsRemaining: MAX_TURNS,
              },
              wsPlayerOne: matchedPlayerOne.wsClient,
              wsPlayerTwo: ws,
              roomId: gameRoomIdCounter,
            };
            availableGameRooms.push(gameRoom);

            // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_ONE
            matchedPlayerOne.wsClient.send(
              JSON.stringify({
                messageType: MessageType.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room: ${gameRoomIdCounter}`,
                player: PLAYER_ONE,
                commStatus: CommStatus.IN_GAME_ROOM,
              })
            );

            // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_TWO
            ws.send(
              JSON.stringify({
                messageType: MessageType.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room ${gameRoomIdCounter}`,
                player: PLAYER_TWO,
                commStatus: CommStatus.IN_GAME_ROOM,
              })
            );

            // Increment gameRoomIdCounter until it reaches the max number of game rooms allowed
            if (gameRoomIdCounter < MAX_GAME_ROOMS) {
              gameRoomIdCounter += 1;
            } else {
              gameRoomIdCounter = 0;
            }
          }
        } else if (matchedPlayerOne) {
          // Send a message of type GAME_ROOM_UNAVAILABLE to PLAYER_ONE
          matchedPlayerOne.wsClient.send(
            JSON.stringify({
              messageType: MessageType.GAME_ROOM_UNAVAILABLE,
              isConnectedToServer: true,
              messageBody: `No game room available at the moment.`,
              player: PLAYER_ONE,
              commStatus: CommStatus.IN_LOBBY,
            })
          );

          // Send a message of type GAME_ROOM_UNAVAILABLE to PLAYER_TWO
          ws.send(
            JSON.stringify({
              messageType: MessageType.GAME_ROOM_UNAVAILABLE,
              isConnectedToServer: true,
              messageBody: `No game room available at the moment.`,
              player: PLAYER_TWO,
              commStatus: CommStatus.IN_LOBBY,
            })
          );
        }
        break;
      default:
        break;
    }
  } else if (message.commStatus === CommStatus.IN_GAME_ROOM) {
    switch (message.messageBody) {
      case MessageType.JOINED_GAME_ROOM:
        // Acknowledging entry and sending a response
        const response = {
          ...message,
          messageType: MessageType.PLAY_GAME,
          messageBody: 'Welcome! Get ready to play',
        };
        ws.send(JSON.stringify(response));
        break;
      default:
        break;
    }
  }
}

function handleWebSocketConnections(server: Server) {
  // Websocket Server
  const wss = new WebSocketServer({ server });
  // Initial message when the client connects to the server
  const clientMessage: WebSocketMessage = {
    messageType: MessageType.READY_TO_SERVE,
    isConnectedToServer: true,
    messageBody: 'Connected to server. Begin communication...',
    player: '',
    commStatus: CommStatus.IN_LOBBY,
  };

  wss.on('connection', (ws) => {
    clientIdCounter += 1;
    logInDev('New WebSocket connection');

    // Send initial message to the newly connected client
    ws.send(JSON.stringify(clientMessage));

    // WebSocket message handler
    ws.on('message', (message: RawData) => {
      logInDev('Received message:', message.toString());

      // ws.send(`${message.toString()}`);

      try {
        const parsedMessage = JSON.parse(message.toString());
        handleIncomingMessage(parsedMessage, ws, wss, clientIdCounter);
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
