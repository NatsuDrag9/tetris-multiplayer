export type StageType = Array<Array<[number | string, string]>>;

export interface KeyCode {
  keyCode: number;
}

export interface WebSocketMessage {
  messageType: string;
  isConnectedToServer: boolean;
  messageBody: string;
  player: string;
  commStatus: string;
}

export interface GameRoomDetails {
  roomId: number;
  entryCode: string;
  player: string;
}
