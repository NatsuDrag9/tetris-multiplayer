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

export const MessageType = {
  // Client message types
  WAITING_FOR_CODE: 'WAITING_FOR_CODE', // Only sent by PLAYER_TWO
  BROADCAST_CODE: 'BROADCAST_CODE', // Only sent by PLAYER_ONE
  READY_TO_JOIN_GAME_ROOM: 'READY_TO_JOIN_GAME_ROOM', // Only sent by PLAYER_TWO
  JOINED_GAME_ROOM: 'JOINED_GAME_ROOM',

  // Server message types
  READY_TO_SERVE: 'READY_TO_SERVE', // Server sends when a new client connects
  GAME_ROOM_ASSIGNED: 'GAME_ROOM_ASSIGNED',
  GAME_ROOM_UNAVAILABLE: 'GAME_ROOM_UNAVAILABLE',
  GAME_OVER: 'GAME_OVER',
  PLAY_GAME: 'PLAY_GAME', // Server sends to the client who entered game room
};

export const PLAYER_ONE = 'PLAYER_ONE';
export const PLAYER_TWO = 'PLAYER_TWO';

export const MAX_GAME_ROOMS = 5;

export const MAX_TURNS = 10;

export default CODE_LENGTH;
