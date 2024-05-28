import express, { Request, Response, NextFunction } from 'express';
import getRandomCode from '@src/routes/api/getRandomCode';
import generateClientId from '@src/routes/api/generateClientId';
import serverMiddlewares from './middlewares/serverMiddlewares';

// Main application that generates the game room code and client id

const app = express();

// Apply Middlewares
serverMiddlewares(app);

// Default - home route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello! This is the backend of tetris multiplayer by Natsu');
});

// Application routes
app.use('/api', getRandomCode);
app.use('/api', generateClientId);

// Catch-all route
app.use((_req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Page Not Found');
  res.status(404);
  next(error);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.statusCode === 404) {
    res.json({ error: 'Page Not Found' });
  } else {
    next(error);
  }
});

export default app;
