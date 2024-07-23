/* eslint-disable indent */

import { ErrorMessage } from '@constants/game';
import { WebSocketMessage } from '@customTypes/gameTypes';
import toast from 'react-hot-toast';

function wsErrorMessageHandler(
  errorMessages: WebSocketMessage[],
  nextFunction: () => void
) {
  errorMessages.forEach((errorMessage) => {
    switch (errorMessage.messageName) {
      case ErrorMessage.CLIENT_TIMEOUT_ERROR:
        toast.error(`${errorMessage.messageBody} Returning to home`);
        nextFunction();
        break;
      case ErrorMessage.COMM_ERROR:
        toast.error(`${errorMessage.messageBody} Returning to home`);
        nextFunction();
        break;
      default:
        break;
    }
  });
}

export default wsErrorMessageHandler;
