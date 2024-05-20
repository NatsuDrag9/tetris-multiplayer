import {
  CommMessage,
  CommStatus,
  MessageType,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@src/constants/appConstants';
import { LobbyMember } from '@src/customTypes/customTypes';
import { availableGameRooms } from '@src/webSocket/webSocketServer';
import { WebSocket } from 'ws';

// Function to remove a client from the list of players
export function removeClientFromList(
  client: WebSocket,
  list: LobbyMember[]
): void {
  const index = list.findIndex((player) => player.wsClient === client);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

// Function to reset the corresponding game room associated with a disconnected client
export function resetGameRoom(client: WebSocket): void {
  const gameRoomIndex = availableGameRooms.findIndex((room) => {
    return room.wsPlayerOne === client || room.wsPlayerTwo === client;
  });

  if (gameRoomIndex !== -1) {
    const gameRoom = availableGameRooms[gameRoomIndex];
    const opponentWs =
      gameRoom.wsPlayerOne === client
        ? gameRoom.wsPlayerTwo
        : gameRoom.wsPlayerOne;

    // Notify the opponent about the disconnection
    if (opponentWs.readyState === WebSocket.OPEN) {
      opponentWs.send(
        JSON.stringify({
          messageType: MessageType.ERROR_MESSAGE,
          messageName: CommMessage.DISCONNECTED,
          isConnectedToServer: true,
          messageBody: 'COMM_ERROR: Your opponent has disconnected.',
          player: gameRoom.wsPlayerOne === client ? PLAYER_TWO : PLAYER_ONE,
          commStatus: CommStatus.IN_LOBBY,
        })
      );
    }

    // Reset the game room
    availableGameRooms.splice(gameRoomIndex, 1);
  }
}

export function determineWinner(
  playerOneScore: number,
  playerOnePenalties: number,
  playerTwoScore: number,
  playerTwoPenalties: number
) {
  if (playerOneScore > playerTwoScore) {
    return PLAYER_ONE;
  }
  if (playerOneScore < playerTwoScore) {
    return PLAYER_TWO;
  }
  if (playerOneScore === playerTwoScore) {
    if (playerOnePenalties < playerTwoPenalties) {
      return PLAYER_ONE;
    }
    if (playerOnePenalties > playerTwoPenalties) {
      return PLAYER_TWO;
    }
    return "It's a draw";
  }
  return 'An error occurred when determining the WINNER';
}
