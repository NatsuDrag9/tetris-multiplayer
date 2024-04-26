import {
  CommStatus,
  CommStatusCheck,
  PLAYER_ONE,
  PLAYER_TWO,
} from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';

function wsCommStatusCheck(
  messages: WebSocketMessage[],
  player: string,
  connectedToServer: boolean
  // navigateTo: () => void
) {
  let commStatus = CommStatusCheck.MESSAGE_DOES_NOT_EXIST;
  // const timeoutId = setTimeout(() => {
  //   // Handle timeout event
  //   logErrorInDev('Server did not respond. Returning to home');
  //   // navigateTo();
  // }, SERVER_ACKNOWLEDGMENT_TIMEOUT);
  if (connectedToServer && player === PLAYER_ONE) {
    if (
      messages.findIndex(
        (message) =>
          message.commStatus === CommStatus.IN_LOBBY &&
          message.player === player
      ) !== -1
    ) {
      // clearTimeout(timeoutId);
      commStatus = CommStatusCheck.PLAYER_ONE_IS_CONNECTED;
    }
  } else {
    commStatus = CommStatusCheck.PLAYER_ONE_IS_DISCONNECTED;
  }
  if (connectedToServer && player === PLAYER_TWO) {
    if (
      messages.findIndex(
        (message) =>
          message.commStatus === CommStatus.IN_LOBBY &&
          message.player === player
      ) !== -1
    ) {
      // clearTimeout(timeoutId);
      commStatus = CommStatusCheck.PLAYER_TWO_IS_CONNECTED;
    }
  } else {
    commStatus = CommStatusCheck.PLAYER_TWO_IS_DISCONNECTED;
  }
  if (connectedToServer && player === '') {
    if (
      messages.findIndex(
        (message) => message.commStatus === CommStatus.IN_LOBBY
      ) !== -1
    ) {
      commStatus = CommStatusCheck.PLAYER_TO_BE_ASSIGNED;
    }
  }

  return commStatus;
}

export default wsCommStatusCheck;
