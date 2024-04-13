import { Request, Response, Router } from 'express';
import generateCode from '@utils/randomCodeGenerator';
import { logErrorInDev } from '@utils/log-utils';
import CODE_LENGTH from '@src/constants/appConstants';

const router = Router();

router.get('/generate-code', (req: Request, res: Response) => {
  try {
    const code = generateCode(CODE_LENGTH);
    res.json({ code });
  } catch (error) {
    logErrorInDev('Error generating code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
