import express from 'express';
import getRandomCode from '@routes/getRandomCode';

const app = express();

// Default - home route
app.get('/', (req, res) => {
  res.send('Hello! This is the backend of tetris multiplayer by Natsu');
});

// Application routes
app.use('/api', getRandomCode);

export default app;
