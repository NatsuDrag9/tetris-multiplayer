import { WebSocket } from 'ws';

export interface Player {
  playerName: string;
  score: number;
  turnsRemaining: number;
  penalties: number;
}

export interface GameRoom {
  roomId: number;
  playerOneInfo: Player;
  playerTwoInfo: Player;
  wsPlayerOne: WebSocket;
  wsPlayerTwo: WebSocket;
  waitingPlayer: string | null;
}

export interface WebSocketMessage {
  messageType: string;
  messageName: string;
  isConnectedToServer: boolean;
  messageBody: string;
  player: string;
  commStatus: string;
}

export interface LobbyMember {
  wsClient: WebSocket;
  clientId: string;
  code: string;
}
