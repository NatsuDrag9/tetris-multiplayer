import { ClientId } from '@src/dbApp';
import removeHyphensFromUUID from '@utils/removeHyphenseFromUUID';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/generate-client-id', async (_req: Request, res: Response) => {
  const clientId = new ClientId({
    _id: removeHyphensFromUUID(uuidv4()),
    gameRoomCode: null,
  });
  try {
    await clientId.save();
    /* Disabling this as _id is used as the primary key for the ClientId schema */
    // eslint-disable-next-line no-underscore-dangle
    res.json({ clientId: clientId._id });
  } catch (error) {
    res.status(500).send('Error generating client ID');
  }
});

export default router;
