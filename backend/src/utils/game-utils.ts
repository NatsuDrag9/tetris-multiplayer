import {
  PLAYER_ONE,
  PLAYER_TWO,
  clientWsMap,
} from '@src/constants/appConstants';
import { WebSocketMessage } from '@src/customTypes/customTypes';
import { WebSocket } from 'ws';
import { deleteGameRoom } from '@src/databaseQuery/gameRoom';
import { deleteClientId } from '@src/databaseQuery/clientId';
import { logErrorInDev } from './log-utils';

export function onWSConnectionClose(roomId: number, clientId: string) {
  deleteGameRoom(roomId);
  clientWsMap.delete(clientId);
  deleteClientId(clientId);
}

export function sendMessageToClient(
  clientId: string,
  message: WebSocketMessage
) {
  const ws = clientWsMap.get(clientId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    logErrorInDev(
      `Failed to send message to client ${clientId}: WebSocket connection not open`
    );
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
