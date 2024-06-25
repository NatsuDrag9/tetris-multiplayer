import { RawData, WebSocketServer, WebSocket } from 'ws';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import { Server } from 'http';
import { WebSocketMessage } from '@src/customTypes/customTypes';
import {
  CLIENT_ACKNOWLEDGMENT_TIMEOUT,
  CommMessage,
  CommStatus,
  ErrorMessage,
  GameMessage,
  MAX_GAME_ROOMS,
  MessageType,
  PLAYER_ONE,
  PLAYER_TWO,
  QueryStatus,
  clientWsMap,
} from '@src/constants/appConstants';
import {
  determineWinner,
  onWSConnectionClose,
  sendMessageToClient,
} from '@utils/game-utils';
import {
  getClientIdByGameRoomAndPlayer,
  updatePlayerRecord,
} from '@src/databaseQuery/clientId';
import {
  createGameRoom,
  getGameRoom,
  updateGameRoomPlayerInfo,
  updateGameRoomWaitingPlayer,
} from '@src/databaseQuery/gameRoom';

// Assigns a unique room id to each gameRoom object
let gameRoomIdCounter: number = 1;

async function handleCommunicationMessages(
  message: WebSocketMessage,
  ws: WebSocket,
  wss: WebSocketServer,
  clientId: string
) {
  if (message.commStatus === CommStatus.IN_LOBBY) {
    switch (message.messageName) {
      case CommMessage.BROADCAST_CODE:
        // Add code and player name to this PLAYER_ONE ClientId record
        updatePlayerRecord(clientId, message.messageBody, message.player);

        // Broadcast the message to all clients except the sender
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
        break;
      case CommMessage.WAITING_FOR_CODE:
        // Do nothing here
        break;
      case CommMessage.READY_TO_JOIN_GAME_ROOM:
        // message.messageBody contains the entered gameRoomCode
        // Add code to this PLAYER_TWO ClientId record
        const updatePlayerRecordResult = await updatePlayerRecord(
          clientId,
          message.messageBody,
          message.player
        );

        if (updatePlayerRecordResult === QueryStatus.SUCCESS) {
          // Get client id of PLAYER_ONE who is paired with this PLAYER_TWO
          const playerOneClientId = await getClientIdByGameRoomAndPlayer(
            message.messageBody,
            PLAYER_ONE
          );
          if (playerOneClientId !== undefined) {
            const createGameRoomResult = await createGameRoom(
              playerOneClientId,
              clientId,
              gameRoomIdCounter,
              message.messageBody
            );

            if (createGameRoomResult === QueryStatus.SUCCESS) {
              // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_ONE
              sendMessageToClient(playerOneClientId, {
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room: ${gameRoomIdCounter}`,
                player: PLAYER_ONE,
                commStatus: CommStatus.IN_GAME_ROOM,
              });

              // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_TWO
              //  clientId here is of PLAYER_TWO as READY_TO_JOIN is only sent by PLAYER_TWO
              sendMessageToClient(clientId, {
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room: ${gameRoomIdCounter}`,
                player: PLAYER_TWO,
                commStatus: CommStatus.IN_GAME_ROOM,
              });

              // Increment gameRoomIdCounter until it reaches the max number of game rooms allowed
              if (gameRoomIdCounter < MAX_GAME_ROOMS) {
                gameRoomIdCounter += 1;
              } else {
                gameRoomIdCounter = 0;
              }
            } else if (createGameRoomResult === QueryStatus.FAILURE) {
              // Send a message of type GAME_ROOM_UNAVAILABLE to PLAYER_ONE
              sendMessageToClient(playerOneClientId, {
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_UNAVAILABLE,
                isConnectedToServer: true,
                messageBody: 'No game room available at the moment.',
                player: PLAYER_ONE,
                commStatus: CommStatus.IN_LOBBY,
              });

              // Send a message of type GAME_ROOM_UNAVAILABLE to PLAYER_TWO
              sendMessageToClient(clientId, {
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_UNAVAILABLE,
                isConnectedToServer: true,
                messageBody: 'No game room available at the moment.',
                player: PLAYER_TWO,
                commStatus: CommStatus.IN_LOBBY,
              });
            }
          }
        }
        break;
      default:
        break;
    }
  } else if (message.commStatus === CommStatus.IN_GAME_ROOM) {
    switch (message.messageName) {
      case CommMessage.JOINED_GAME_ROOM:
        // Acknowledging entry and sending a response
        const response = {
          ...message,
          messageTye: MessageType.GAME_MESSAGE,
          messageName: GameMessage.PLAY_GAME,
          messageBody: 'Welcome! Get ready to play',
        };
        ws.send(JSON.stringify(response));
        break;
      case GameMessage.TURN_INFO:
        const parsedMessage = JSON.parse(message.messageBody);

        const playerInfo = {
          playerName: parsedMessage.playerName,
          score: parsedMessage.score,
          turnsRemaining: parsedMessage.turnsRemaining,
          penalties: parsedMessage.penalties,
        };

        updateGameRoomPlayerInfo(parsedMessage.roomId, playerInfo);
        break;
      case GameMessage.GAME_OVER:
        const gameRoomDetails = JSON.parse(message.messageBody);
        const matchedGameRoom = await getGameRoom(gameRoomDetails.roomId);
        const playerOneClientId = await getClientIdByGameRoomAndPlayer(
          gameRoomDetails.gameRoomCode,
          PLAYER_ONE
        );
        const playerTwoClientId = await getClientIdByGameRoomAndPlayer(
          gameRoomDetails.gameRoomCode,
          PLAYER_TWO
        );

        if (matchedGameRoom && playerOneClientId && playerTwoClientId) {
          if (
            matchedGameRoom.playerOneInfo.turnsRemaining > 0 &&
            matchedGameRoom.playerTwoInfo.turnsRemaining === 0
          ) {
            updateGameRoomWaitingPlayer(gameRoomDetails.roomId, PLAYER_TWO);

            // Send player two message that player one is still playing
            sendMessageToClient(playerTwoClientId, {
              messageType: MessageType.GAME_MESSAGE,
              messageName: GameMessage.WAITING_PLAYER,
              isConnectedToServer: true,
              messageBody: 'Waiting for your opponent to finish',
              player: PLAYER_TWO,
              commStatus: CommStatus.IN_GAME_ROOM,
            });
          } else if (
            matchedGameRoom.playerOneInfo.turnsRemaining === 0 &&
            matchedGameRoom.playerTwoInfo.turnsRemaining > 0
          ) {
            // Send player one message that player two is still playing
            updateGameRoomWaitingPlayer(gameRoomDetails.roomId, PLAYER_ONE);
            sendMessageToClient(playerTwoClientId, {
              messageType: MessageType.GAME_MESSAGE,
              messageName: GameMessage.WAITING_PLAYER,
              isConnectedToServer: true,
              messageBody: 'Waiting for your opponent to finish',
              player: PLAYER_ONE,
              commStatus: CommStatus.IN_GAME_ROOM,
            });
          }

          if (
            matchedGameRoom.playerOneInfo.turnsRemaining === 0 &&
            matchedGameRoom.playerTwoInfo.turnsRemaining === 0
          ) {
            const winner = determineWinner(
              matchedGameRoom.playerOneInfo.score,
              matchedGameRoom.playerOneInfo.penalties,
              matchedGameRoom.playerTwoInfo.score,
              matchedGameRoom.playerTwoInfo.penalties
            );

            const winnerMessage = {
              messageType: MessageType.GAME_MESSAGE,
              messageName: GameMessage.WINNER,
              isConnectedToServer: true,
              messageBody: `${winner}`,
              commStatus: CommStatus.IN_GAME_ROOM,
            };

            // Send the winner message to both players
            sendMessageToClient(playerOneClientId, {
              ...winnerMessage,
              player: PLAYER_ONE,
            });

            sendMessageToClient(playerTwoClientId, {
              ...winnerMessage,
              player: PLAYER_TWO,
            });
          }
        }
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
    messageType: MessageType.COMM_MESSAGE,
    messageName: CommMessage.READY_TO_SERVE,
    isConnectedToServer: true,
    messageBody: 'Connected to server. Begin communication...',
    player: '',
    commStatus: CommStatus.IN_LOBBY,
  };

  wss.on('connection', async (ws, req) => {
    const clientId = req.headers['sec-websocket-protocol'];
    logInDev('New WebSocket connection by clientId: ', clientId);

    // Initialize counter for game room
    // initializeCounter();

    if (clientId) {
      clientWsMap.set(clientId, ws);
    }

    // Send initial message to the newly connected client
    ws.send(JSON.stringify(clientMessage));

    // Set acknowledgment timeout
    const acknowledgementTimeout = setTimeout(() => {
      logInDev('Acknowledgment timeout. Client did not respond.');

      const clientMessageTimeout: WebSocketMessage = {
        messageType: MessageType.ERROR_MESSAGE,
        messageName: ErrorMessage.CLIENT_TIMEOUT_ERROR,
        isConnectedToServer: false,
        messageBody: 'No response from client.',
        player: '',
        commStatus: CommStatus.IN_LOBBY,
      };

      ws.send(JSON.stringify(clientMessageTimeout));

      // Connection close operations
      if (clientId) {
        onWSConnectionClose(gameRoomIdCounter - 1, clientId);
      }

      // Automatically disconnect the client
      ws.terminate();
    }, CLIENT_ACKNOWLEDGMENT_TIMEOUT);

    // WebSocket message handler
    ws.on('message', (message: RawData) => {
      logInDev('Received message:', message.toString());

      // ws.send(`${message.toString()}`);

      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
        if (clientId !== undefined) {
          handleCommunicationMessages(parsedMessage, ws, wss, clientId);
        }
      } catch (error) {
        logErrorInDev('Error parsing WebSocket message:', error);
      }
    });

    // WebSocket close handler
    ws.on('close', () => {
      // Connection close operations
      if (clientId) {
        onWSConnectionClose(gameRoomIdCounter - 1, clientId);
      }
      clearTimeout(acknowledgementTimeout);
      logInDev('WebSocket connection closed');
    });

    // WebSocket error handler
    ws.on('error', (error: Error) => {
      logErrorInDev('WebSocket error:', error);
    });
  });
}

export default handleWebSocketConnections;
