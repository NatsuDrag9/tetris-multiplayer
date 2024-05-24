import { GameRoom } from '@src/dbApp';
import { Router, Request, Response } from 'express';

const router = Router();

// POST endpoint to create a new game room
router.post('/', async (req: Request, res: Response) => {
  try {
    const newRoom = new GameRoom(req.body);
    await newRoom.save();
    res.status(201).send(newRoom);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET endpoint to retrieve a game room by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const room = await GameRoom.findById(req.params.id);
    if (!room) {
      res.status(404).send();
    }
    res.send(room);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
