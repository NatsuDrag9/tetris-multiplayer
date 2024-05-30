export type StageType = Array<Array<[number | string, string]>>;

export interface KeyCode {
  keyCode: number;
}

export interface WebSocketMessage {
  messageType: string;
  messageName: string;
  isConnectedToServer: boolean;
  messageBody: string;
  player: string;
  commStatus: string;
}

export interface GameRoomDetails {
  roomId: number;
  gameRoomCode: string;
  player: string;
}

export interface Player {
  playerName: string;
  score: number;
  turnsRemaining: number;
  penalties: number;
}
