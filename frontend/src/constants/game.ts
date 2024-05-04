export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const TETROMINO_STAGE_WIDTH = 4;
export const TETROMINO_STAGE_HEIGHT = 4;

export const CLEAR_CELL = 'CLEAR';
export const MERGE_CELL = 'MERGED';

export const INITIAL_ROWS_CLEARED = 0;
export const INITIAL_SCORE = 0;
export const INITAL_ROWS = 0;
export const INITIAL_LEVEL = 1;

export const BASE_DROP_TIME = 1000; // in sec
export const DROP_TIME_INCR = 200; // in sec

// Keyboard keys key code
export const KEY_CODE_LEFT = 37;
export const KEY_CODE_RIGHT = 39;
export const KEY_CODE_DOWN = 40;
export const KEY_CODE_UP = 38;

// Scores taken from web
export const LINE_POINTS = [40, 100, 300, 1200];

// Web socket for multiplayer
// export const GameCommMode = {
//   CODE: 'CODE',
//   ENTER_CODE: 'ENTER_CODE',
//   JOIN_GAME_ROOM: 'JOIN_GAME_ROOM',
// };

// export const PlayerJoined = {
//   PLAYER_ONE_JOINED: 'PLAYER_ONE_JOINED',
//   PLAYER_TWO_JOINED: 'PLAYER_TWO_JOINED',
// };

// Communication constants
export const CommStatus = {
  IN_GAME_ROOM: 'IN_GAME_ROOM',
  IN_LOBBY: 'IN_LOBBY',
};

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
  GAME_OVER: 'GAME_OVER',
  PLAY_GAME: 'PLAY_GAME', // Server sends to the client who entered game room
};
export const GameMessage = {};
export const ErrorMessage = {
  CLIENT_TIMEOUT_ERROR: 'CLIENT_TIMEOUT_ERROR',
  COMM_ERROR: 'COMMUNICATION_ERROR',
};

export const PLAYER_ONE = 'PLAYER_ONE';
export const PLAYER_TWO = 'PLAYER_TWO';
export const NO_PLAYER = '';

export const NavigationCodes = {
  YES: 1,
  NO: 2,
  ERR: -1,
};

export const CommStatusCheck = {
  PLAYER_ONE_IS_CONNECTED: 1,
  PLAYER_TWO_IS_CONNECTED: 1,
  PLAYER_ONE_IS_DISCONNECTED: 0,
  PLAYER_TWO_IS_DISCONNECTED: 0,
  PLAYER_TO_BE_ASSIGNED: 2,
  MESSAGE_DOES_NOT_EXIST: -1,
};

// Lobby timeouts
export const RETURN_HOME_TIMER = 2000; // in ms
export const SERVER_ACKNOWLEDGMENT_TIMEOUT = 5000; // in ms
export const CODE_TIMEOUT = 10; // in sec

// Game Room timeouts
export const TURN_TIMER = 30; // Wait for 30 sec to make a move
