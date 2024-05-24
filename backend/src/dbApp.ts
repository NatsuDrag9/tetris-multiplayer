import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import gameRoomRoutes from '@routes/gameRoomRoutes';
import { logErrorInDev, logInDev } from '@utils/log-utils';
import serverMiddlewares from './middlewares/serverMiddlewares';

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

// MongoDB schema for GameRoom
const GameRoomSchema = new mongoose.Schema({
  roomId: Number,
  playerOneInfo: Object,
  playerTwoInfo: Object,
  waitingPlayer: String,
});

export const GameRoom = mongoose.model('GameRoom', GameRoomSchema);

// Apply gameRoom routes
dbApp.use('/api/gameRooms', gameRoomRoutes);

export default dbApp;
