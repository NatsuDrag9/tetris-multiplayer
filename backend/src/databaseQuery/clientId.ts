import { QueryStatus } from '@src/constants/appConstants';
import { ClientId } from '@src/dbApp';
import { logErrorInDev, logInDev } from '@utils/log-utils';

export async function deleteClientId(id: string | undefined): Promise<number> {
  try {
    const deletedClientId = await ClientId.findByIdAndDelete(id);
    if (deletedClientId) {
      logInDev(`Successfully deleted ${id}`);
      return QueryStatus.SUCCESS;
    }
    logInDev(`No client ID found with ID: ${id}`);
    return QueryStatus.FAILURE;
  } catch (error: unknown) {
    logErrorInDev(`Error deleting client ID: ${error}`);
    throw error;
  }
}

export async function updatePlayerRecord(
  id: string,
  gameRoomCode: string,
  playerName: string
): Promise<number> {
  try {
    const updatedClientId = await ClientId.findByIdAndUpdate(
      id,
      { gameRoomCode, playerName },
      { new: true }
    );
    if (updatedClientId) {
      logInDev(`Game room code and player name added to ${id}: `, id);
      return QueryStatus.SUCCESS;
    }
    logInDev(`No ClientId found with Id: ${id}`, id);
    return QueryStatus.FAILURE;
  } catch (error) {
    logErrorInDev(
      `An error occurred when adding game room code to the clientid: ${id}`,
      error
    );
    throw error;
  }
}

export async function getClientIdByGameRoomAndPlayer(
  gameRoomCode: string,
  playerName: string
) {
  try {
    const clientId = await ClientId.findOne({ gameRoomCode, playerName });
    if (clientId) {
      logInDev(
        `ClientID found for gameRoomCode: ${gameRoomCode}, playerName: ${playerName}`
      );
      // eslint-disable-next-line no-underscore-dangle
      return clientId._id;
    }
    logInDev(
      `No ClientId found for gameRoomCode: ${gameRoomCode}, playerName: ${playerName}`
    );

    return '';
  } catch (error) {
    logErrorInDev(
      `An error occurred when getting clientId by gameRoomCode and playerName: gameRoomCode: ${gameRoomCode}, playerName: ${playerName}`,
      error
    );
    throw error;
  }
}
