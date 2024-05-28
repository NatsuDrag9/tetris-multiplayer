import { ClientId } from '@src/dbApp';
import { logErrorInDev, logInDev } from '@utils/log-utils';

async function deleteClientId(id: string | undefined) {
  try {
    const deletedClientId = await ClientId.findByIdAndDelete(id);
    if (deletedClientId) {
      logInDev(`Successfully deleted ${id}`);
    } else {
      logInDev(`No client ID found with ID: ${id}`);
    }
  } catch (error: unknown) {
    logErrorInDev(`Error deleting client ID: ${error}`);
  }
}

export default deleteClientId;
