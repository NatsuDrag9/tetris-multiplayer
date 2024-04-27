import { GameRoomDetails } from '@customTypes/gameTypes';
import getNumberAfterColon from '@utils/get-number-after-colon';
import { logErrorInDev } from '@utils/log-utils';
import { useState } from 'react';

function useGameRoom() {
  const [gameRoomDetails, setGameRoomDetails] =
    useState<GameRoomDetails | null>(null);

  const updateGameRoomDetails = (
    messageBody: string,
    code: string,
    player: string
  ) => {
    const roomId = getNumberAfterColon(messageBody);
    if (roomId === null) {
      logErrorInDev('Room id is null. Check Server.', roomId);
      return;
    }
    setGameRoomDetails({
      roomId,
      entryCode: code,
      player,
    });
  };

  return {
    gameRoomDetails,
    updateGameRoomDetails,
  };
}

export default useGameRoom;
