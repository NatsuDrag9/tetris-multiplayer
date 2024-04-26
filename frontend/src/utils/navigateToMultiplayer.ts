import { CommMessage, NavigationCodes } from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';
import { logInDev } from './log-utils';

function navigateToMultiplayer(message: WebSocketMessage) {
  if (message.messageName === CommMessage.GAME_ROOM_ASSIGNED) {
    return NavigationCodes.YES;
  }
  if (message.messageName === CommMessage.GAME_ROOM_UNAVAILABLE) {
    logInDev('Game room unavailable');
    return NavigationCodes.NO;
  }
  // logErrorInDev("Couldn't assign game room due to an unexpected server error");
  return NavigationCodes.ERR;
}

export default navigateToMultiplayer;
