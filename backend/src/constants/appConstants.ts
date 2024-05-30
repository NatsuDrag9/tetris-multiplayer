import { WebSocket } from 'ws';

const CODE_LENGTH = 6;

// export const GameCommMode = {
//   CODE: 'CODE',
//   ENTER_CODE: 'ENTER_CODE',
//   JOIN_GAME_ROOM: 'JOIN_GAME_ROOM',
// };

export const CommStatus = {
  IN_GAME_ROOM: 'IN_GAME_ROOM',
  IN_LOBBY: 'IN_LOBBY',
};

// export const MessageType = {
//   // Client message types
//   WAITING_FOR_CODE: 'WAITING_FOR_CODE', // Only sent by PLAYER_TWO
//   BROADCAST_CODE: 'BROADCAST_CODE', // Only sent by PLAYER_ONE
//   READY_TO_JOIN_GAME_ROOM: 'READY_TO_JOIN_GAME_ROOM', // Only sent by PLAYER_TWO
//   JOINED_GAME_ROOM: 'JOINED_GAME_ROOM',

//   // Message types common to server and client
//   DISCONNECTED: 'DISCONNECTED',

//   // Server message types
//   READY_TO_SERVE: 'READY_TO_SERVE', // Server sends when a new client connects
//   GAME_ROOM_ASSIGNED: 'GAME_ROOM_ASSIGNED',
//   GAME_ROOM_UNAVAILABLE: 'GAME_ROOM_UNAVAILABLE',
//   GAME_OVER: 'GAME_OVER',
//   PLAY_GAME: 'PLAY_GAME', // Server sends to the client who entered game room
// };

export const MessageType = {
  COMM_MESSAGE: 'COMMUNICATION_MESSAGE',
  GAME_MESSAGE: 'GAME_MESSAGE',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
};

export const CommMessage = {
  // Client message types
  WAITING_FOR_CODE: 'WAITING_FOR_CODE', // Only sent by PLAYER_TWO
  BROADCAST_CODE: 'BROADCAST_CODE', // Only sent by PLAYER_ONE
  READY_TO_JOIN_GAME_ROOM: 'READY_TO_JOIN_GAME_ROOM', // Only sent by PLAYER_TWO
  JOINED_GAME_ROOM: 'JOINED_GAME_ROOM',

  // Message types common to server and client
  DISCONNECTED: 'DISCONNECTED',

  // Server message types
  READY_TO_SERVE: 'READY_TO_SERVE', // Server sends when a new client connects
  GAME_ROOM_ASSIGNED: 'GAME_ROOM_ASSIGNED',
  GAME_ROOM_UNAVAILABLE: 'GAME_ROOM_UNAVAILABLE',
};

export const GameMessage = {
  TURN_INFO: 'TURN_INFO',
  GAME_OVER: 'GAME_OVER',
  PLAY_GAME: 'PLAY_GAME', // Server sends to the client who entered game room
  WINNER: 'WINNER',
  WAITING_PLAYER: 'WAITING_PLAYER',
};

export const ErrorMessage = {
  CLIENT_TIMEOUT_ERROR: 'CLIENT_TIMEOUT_ERROR',
  COMM_ERROR: 'COMMUNICATION_ERROR',
};

export const PLAYER_ONE = 'PLAYER_ONE';
export const PLAYER_TWO = 'PLAYER_TWO';

export const MAX_GAME_ROOMS = 5;

export const MAX_TURNS = 5;

export const CLIENT_ACKNOWLEDGMENT_TIMEOUT = 180 * 1000; // Wait for 3 min (in ms)

export const CLIENT_ID_EXPIRY_DURATION = 3600; // one hour

// Mapping to store clientId and corresponding ws object
export const clientWsMap = new Map<string, WebSocket>();

// Mongoose DB query constants
export const QueryStatus = {
  SUCCESS: 1,
  FAILURE: 0,
  ERR: -1,
};

export default CODE_LENGTH;
