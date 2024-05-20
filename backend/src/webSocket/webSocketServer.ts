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
  CLIENT_ACKNOWLEDGMENT_TIMEOUT,
  CommMessage,
  CommStatus,
  ErrorMessage,
  GameMessage,
  MAX_GAME_ROOMS,
  MAX_TURNS,
  MessageType,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@src/constants/appConstants';
import {
  determineWinner,
  removeClientFromList,
  resetGameRoom,
} from '@utils/game-utils';

// Counter to uniquely identify each client
let clientIdCounter: number = 0;

// Assigns a unique room id to each gameRoom object
let gameRoomIdCounter: number = 1;

// Array to store game rooms
export const availableGameRooms: GameRoom[] = [];
const allPlayerOnes: LobbyMember[] = [];
const allPlayerTwos: LobbyMember[] = [];

function handleCommunicationMessages(
  message: WebSocketMessage,
  ws: WebSocket,
  wss: WebSocketServer,
  clientId: number
) {
  if (message.commStatus === CommStatus.IN_LOBBY) {
    // All communication when
    switch (message.messageName) {
      case CommMessage.BROADCAST_CODE:
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
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
        break;
      case CommMessage.WAITING_FOR_CODE:
        // Add new PLAYER_TWO to the list and keep the code field empty
        if (message.player === PLAYER_TWO) {
          allPlayerTwos.push({
            wsClient: ws,
            code: '',
            clientId,
          });
        }
        break;
      case CommMessage.READY_TO_JOIN_GAME_ROOM:
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
                playerName: PLAYER_TWO,
                score: 0,
                turnsRemaining: MAX_TURNS,
              },
              wsPlayerOne: matchedPlayerOne.wsClient,
              wsPlayerTwo: ws,
              roomId: gameRoomIdCounter,
              waitingPlayer: null,
            };
            availableGameRooms.push(gameRoom);

            // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_ONE
            matchedPlayerOne.wsClient.send(
              JSON.stringify({
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room: ${gameRoomIdCounter}`,
                player: PLAYER_ONE,
                commStatus: CommStatus.IN_GAME_ROOM,
              })
            );

            // Send a message of type GAME_ROOM_ASSIGNED to PLAYER_TWO
            ws.send(
              JSON.stringify({
                messageType: MessageType.COMM_MESSAGE,
                messageName: CommMessage.GAME_ROOM_ASSIGNED,
                isConnectedToServer: true,
                messageBody: `You are assigned game room: ${gameRoomIdCounter}`,
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
          logInDev(
            'Sending no game room available to matched player one: ',
            matchedPlayerOne.code
          );
          matchedPlayerOne.wsClient.send(
            JSON.stringify({
              messageType: MessageType.COMM_MESSAGE,
              messageName: CommMessage.GAME_ROOM_UNAVAILABLE,
              isConnectedToServer: true,
              messageBody: 'No game room available at the moment.',
              player: PLAYER_ONE,
              commStatus: CommStatus.IN_LOBBY,
            })
          );

          // Send a message of type GAME_ROOM_UNAVAILABLE to PLAYER_TWO
          ws.send(
            JSON.stringify({
              messageType: MessageType.COMM_MESSAGE,
              messageName: CommMessage.GAME_ROOM_UNAVAILABLE,
              isConnectedToServer: true,
              messageBody: 'No game room available at the moment.',
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
        const matchedIndex = availableGameRooms.findIndex(
          (gameRoom: GameRoom) => gameRoom.roomId === parsedMessage.roomId
        );
        if (parsedMessage.playerName === PLAYER_ONE) {
          availableGameRooms[matchedIndex].playerOneInfo = {
            playerName: parsedMessage.playerName,
            score: parsedMessage.score,
            turnsRemaining: parsedMessage.turnsRemaining,
            penalties: parsedMessage.penalties,
          };
        } else if (parsedMessage.playerName === PLAYER_TWO) {
          availableGameRooms[matchedIndex].playerTwoInfo = {
            playerName: parsedMessage.playerName,
            score: parsedMessage.score,
            turnsRemaining: parsedMessage.turnsRemaining,
            penalties: parsedMessage.penalties,
          };
        }
        logInDev(
          'Turn info: ',
          availableGameRooms[matchedIndex].playerOneInfo,
          availableGameRooms[matchedIndex].playerTwoInfo,
          availableGameRooms[matchedIndex].roomId
        );
        break;
      case GameMessage.GAME_OVER:
        const gameRoomDetails = JSON.parse(message.messageBody);
        const matchedRoomIndex = availableGameRooms.findIndex(
          (gameRoom: GameRoom) => gameRoom.roomId === gameRoomDetails.roomId
        );
        const gameRoom = availableGameRooms[matchedRoomIndex];

        const matchedPlayerOne =
          allPlayerOnes[
            allPlayerOnes.findIndex(
              (playerOne) => playerOne.wsClient === gameRoom.wsPlayerOne
            )
          ];

        const matchedPlayerTwo =
          allPlayerTwos[
            allPlayerTwos.findIndex(
              (playerTwo) => playerTwo.wsClient === gameRoom.wsPlayerTwo
            )
          ];
        if (
          gameRoom.playerOneInfo.turnsRemaining > 0 &&
          gameRoom.playerTwoInfo.turnsRemaining === 0
        ) {
          // Send player two message that player one is still playing
          availableGameRooms[matchedRoomIndex].waitingPlayer = PLAYER_TWO;
          matchedPlayerTwo.wsClient.send(
            JSON.stringify({
              messageType: MessageType.GAME_MESSAGE,
              messageName: GameMessage.WINNER,
              isConnectedToServer: true,
              messageBody: 'Waiting for your opponent to finish',
              player: PLAYER_TWO,
              commStatus: CommStatus.IN_GAME_ROOM,
            })
          );
        } else if (
          gameRoom.playerOneInfo.turnsRemaining === 0 &&
          gameRoom.playerTwoInfo.turnsRemaining > 0
        ) {
          availableGameRooms[matchedRoomIndex].waitingPlayer = PLAYER_ONE;
          matchedPlayerOne.wsClient.send(
            JSON.stringify({
              messageType: MessageType.GAME_MESSAGE,
              messageName: GameMessage.WAITING_PLAYER,
              isConnectedToServer: true,
              messageBody: 'Waiting for your opponent to finish',
              player: PLAYER_ONE,
              commStatus: CommStatus.IN_GAME_ROOM,
            })
          );
        }

        // Check if both players have finished their turns
        if (
          gameRoom.playerOneInfo.turnsRemaining === 0 &&
          gameRoom.playerTwoInfo.turnsRemaining === 0
        ) {
          const winner = determineWinner(
            gameRoom.playerOneInfo.score,
            gameRoom.playerOneInfo.penalties,
            gameRoom.playerTwoInfo.score,
            gameRoom.playerTwoInfo.penalties
          );

          const winnerMessage = JSON.stringify({
            messageType: MessageType.GAME_MESSAGE,
            messageName: GameMessage.WINNER,
            isConnectedToServer: true,
            messageBody: `${winner}`,
            commStatus: CommStatus.IN_GAME_ROOM,
          });

          // Send the winner message to both players
          matchedPlayerOne.wsClient.send(
            JSON.stringify({
              ...JSON.parse(winnerMessage),
              player: PLAYER_ONE,
            })
          );

          matchedPlayerTwo.wsClient.send(
            JSON.stringify({
              ...JSON.parse(winnerMessage),
              player: PLAYER_TWO,
            })
          );

          // Reset the waitingPlayer key of the current gameRoom
          availableGameRooms[matchedRoomIndex].waitingPlayer = null;
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

  wss.on('connection', (ws) => {
    clientIdCounter += 1;
    logInDev('New WebSocket connection');

    // Send initial message to the newly connected client
    ws.send(JSON.stringify(clientMessage));

    // Set acknowledgment timeout
    const acknowledgementTimeout = setTimeout(() => {
      logInDev('Acknowledgment timeout. Client did not respond.');

      // Rremoving the client from lists and resetting game rooms
      removeClientFromList(ws, allPlayerOnes);
      removeClientFromList(ws, allPlayerTwos);
      resetGameRoom(ws);

      const clientMessageTimeout: WebSocketMessage = {
        messageType: MessageType.ERROR_MESSAGE,
        messageName: ErrorMessage.CLIENT_TIMEOUT_ERROR,
        isConnectedToServer: false,
        messageBody: 'No response from client.',
        player: '',
        commStatus: CommStatus.IN_LOBBY,
      };

      ws.send(JSON.stringify(clientMessageTimeout));

      // Automatically disconnect the client
      ws.terminate();
    }, CLIENT_ACKNOWLEDGMENT_TIMEOUT);

    // WebSocket message handler
    ws.on('message', (message: RawData) => {
      logInDev('Received message:', message.toString());

      // ws.send(`${message.toString()}`);

      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
        // if (parsedMessage.messageType === MessageType.COMM_MESSAGE) {
        //   handleCommunicationMessages(parsedMessage, ws, wss, clientIdCounter);
        // }
        handleCommunicationMessages(parsedMessage, ws, wss, clientIdCounter);
      } catch (error) {
        logErrorInDev('Error parsing WebSocket message:', error);
      }
    });

    // WebSocket close handler
    ws.on('close', () => {
      logInDev('WebSocket connection closed');
      clearTimeout(acknowledgementTimeout);
    });

    // WebSocket error handler
    ws.on('error', (error: Error) => {
      logErrorInDev('WebSocket error:', error);
    });
  });
}

export default handleWebSocketConnections;
