import express, { Request, Response, NextFunction } from 'express';
import getRandomCode from '@src/routes/getRandomCode';
import serverMiddlewares from './middlewares/serverMiddlewares';

const app = express();

// Apply Middlewares
serverMiddlewares(app);

// Default - home route
app.get('/', (req, res) => {
  res.send('Hello! This is the backend of tetris multiplayer by Natsu');
});

// Application routes
app.use('/api', getRandomCode);

// Catch-all route
app.use((req, res, next) => {
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
