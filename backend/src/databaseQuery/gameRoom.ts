import {
  MAX_TURNS,
  PLAYER_ONE,
  PLAYER_TWO,
  QueryStatus,
} from '@src/constants/appConstants';
import { Player } from '@src/customTypes/customTypes';
import { GameRoom } from '@src/dbApp';
import { logErrorInDev, logInDev } from '@utils/log-utils';

// export async function initializeCounter() {
//   const counter = await Counter.findById('roomId');
//   if (!counter) {
//     await Counter.create({ _id: 'roomId', sequence_value: 0 });
//   }
// }

// GameRoomSchema.pre('save', async function (next) {
//   const doc = this;
//   try {
//     // Find and increment the counter value
//     const counter = await Counter.findByIdAndUpdate(
//       'roomId',
//       { $inc: { sequence_value: 1 } },
//       { new: true, upsert: true }
//     );

//     // Assign the new room ID to the document
//     doc.roomId = counter.sequence_value;
//     next();
//   } catch (error) {
//     logErrorInDev(
//       'An error occurred when incrementing game room counter',
//       error
//     );
//   }
// });

export async function createGameRoom(
  p1ClientId: string,
  p2ClientId: string,
  roomId: number,
  gameRoomCode: string
): Promise<number> {
  try {
    const newRoom = new GameRoom({
      roomId,
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
      roomCode: gameRoomCode,
      playerOneClientId: p1ClientId,
      playerTwoClientId: p2ClientId,
      waitingPlayer: null,
    });
    const result = await newRoom.save();

    if (result) {
      return QueryStatus.SUCCESS;
    }
    return QueryStatus.FAILURE;
  } catch (error) {
    logErrorInDev('An error occurred when creating a game room', error);
    throw error;
  }
}

export async function getGameRoom(roomId: number) {
  try {
    const gameRoom = await GameRoom.findOne({ roomId });

    if (gameRoom) {
      logInDev('Found game room record having room id: ', roomId);
      return gameRoom;
    }
    logInDev('No game room record having room id: ', roomId, ' exists');
    return '';
  } catch (error) {
    logErrorInDev(
      `An error occurred when finding a game room record with roomId: ${roomId}`,
      error
    );
    throw error;
  }
}

export async function updateGameRoomPlayerInfo(
  roomId: number,
  playerInfo: Player
) {
  try {
    const update: { [key: string]: unknown } = {};
    if (playerInfo.playerName === PLAYER_ONE) {
      update.playerOneInfo = playerInfo;
    } else {
      update.playerTwoInfo = playerInfo;
    }
    const gameRoom = await GameRoom.findOneAndUpdate({ roomId }, update, {
      new: true,
    });

    if (gameRoom) {
      logInDev('Found game room record having room id: ', roomId);
      return QueryStatus.SUCCESS;
    }
    logInDev('No game room record having room id: ', roomId, ' exists');
    return QueryStatus.FAILURE;
  } catch (error) {
    logErrorInDev(
      `An error occurred when finding a game room record with roomId: ${roomId}`,
      error
    );
    throw error;
  }
}

export async function updateGameRoomWaitingPlayer(
  roomId: number,
  waitingPlayerName: string
) {
  try {
    const result = await GameRoom.findOneAndUpdate(
      { roomId },
      { waitingPlayer: waitingPlayerName },
      {
        new: true,
      }
    );

    if (result) {
      logInDev(
        'Updated waiting player in game room record having room id: ',
        roomId
      );
      return QueryStatus.SUCCESS;
    }
    logInDev('No game room record having room id: ', roomId, ' exists');
    return QueryStatus.FAILURE;
  } catch (error) {
    logErrorInDev(
      `An error occurred when updating waiting player in the game room record with roomId: ${roomId}`,
      error
    );
    throw error;
  }
}

export async function deleteGameRoom(roomId: number): Promise<number> {
  try {
    const deletedClientId = await GameRoom.findOneAndDelete({ roomId });
    if (deletedClientId) {
      logInDev(`Successfully deleted game room: `, roomId);
      return QueryStatus.SUCCESS;
    }
    logInDev(`No game room found with ID: ${roomId}`);
    return QueryStatus.FAILURE;
  } catch (error: unknown) {
    logErrorInDev(`Error deleting game room: ${error}`);
    throw error;
  }
}
