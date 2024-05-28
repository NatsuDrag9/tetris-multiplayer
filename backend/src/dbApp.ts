import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import gameRoomRoutes from '@src/routes/api/gameRoomRoutes';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import serverMiddlewares from './middlewares/serverMiddlewares';
import { CLIENT_ID_EXPIRY_DURATION } from './constants/appConstants';

// Database application

dotenv.config({ path: `.env.development` });

const dbApp = express();

// Apply middlewares
serverMiddlewares(dbApp);
dbApp.use(bodyParser.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    // Ensure the environment variable is defined
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    await mongoose.connect(mongoURI);
    logInDev('MongoDB connected successfully');
  } catch (error) {
    logErrorInDev('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// MongoDB schema for Player
const PlayerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  turnsRemaining: {
    type: Number,
    required: true,
  },
  penalties: {
    type: Number,
    required: true,
    default: 0,
  },
});

// MongoDB schema for GameRoom
export const GameRoomSchema = new mongoose.Schema({
  roomId: {
    type: Number,
    required: true,
    unique: true, // assuming room IDs should be unique
  },
  playerOneInfo: {
    type: PlayerSchema,
    required: true,
  },
  playerTwoInfo: {
    type: PlayerSchema,
    required: true,
  },
  playerOneClientId: {
    type: String,
    required: true,
  },
  playerTwoClientId: {
    type: String,
    required: true,
  },
  waitingPlayer: {
    type: String,
    default: null,
  },
});

export const clientIDSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  gameRoomCode: {
    type: String,
    default: null,
  },
  playerName: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: CLIENT_ID_EXPIRY_DURATION, // expires after one hour
  },
});

// export const counterSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 0 },
// });

export const GameRoom = mongoose.model('GameRoom', GameRoomSchema);
export const ClientId = mongoose.model('ClientId', clientIDSchema);
// export const Counter = mongoose.model('Counter', counterSchema);

// Default - home route
dbApp.get('/', (_req: Request, res: Response) => {
  res.send('Hello! This is the DB server of tetris multiplayer');
});

// Apply gameRoom routes
dbApp.use('/api/gameRooms', gameRoomRoutes);

export default dbApp;
