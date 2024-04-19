import {
  CommStatus,
  CommStatusCheck,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';

function wsCommStatusCheck(messages: WebSocketMessage[], player: string) {
  if (player === PLAYER_ONE) {
    if (
      messages.findIndex(
        (message) =>
          message.isConnectedToServer &&
          message.commStatus === CommStatus.IN_LOBBY &&
          message.player === player
      ) !== -1
    ) {
      return CommStatusCheck.PLAYER_ONE_IS_CONNECTED;
    }
    return CommStatusCheck.PLAYER_ONE_IS_DISCONNECTED;
  }
  if (player === PLAYER_TWO) {
    if (
      messages.findIndex(
        (message) =>
          message.isConnectedToServer &&
          message.commStatus === CommStatus.IN_LOBBY &&
          message.player === player
      ) !== -1
    ) {
      return CommStatusCheck.PLAYER_TWO_IS_CONNECTED;
    }
    return CommStatusCheck.PLAYER_TWO_IS_DISCONNECTED;
  }
  if (player === '') {
    if (
      messages.findIndex(
        (message) =>
          message.isConnectedToServer &&
          message.commStatus === CommStatus.IN_LOBBY
      ) !== -1
    ) {
      return CommStatusCheck.PLAYER_TO_BE_ASSIGNED;
    }
  }

  return CommStatusCheck.MESSAGE_DOES_NOT_EXIST;
}

export default wsCommStatusCheck;
