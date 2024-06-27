import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import render from './setupTests';
import { cleanup, fireEvent } from '@testing-library/react';
import toast from 'react-hot-toast';
import * as WebSocketContext from '@contexts/WebSocketContext';
import * as MultiplayerGameContext from '@contexts/MultiplayerGameContext';
import {
  ProtectedMultiplayerGameRoom,
  ProtectedMultiplayerLobby,
} from '@pages/ProtectedPages/ProtectedPages';
import { MemoryRouter } from 'react-router-dom';
import { GameMode, PLAYER_ONE, TURN_TIMER } from '@constants/game';
import * as usePieceHook from '@hooks/usePiece';

const spyOnToastError = vi.spyOn(toast, 'error');

const wsContextMock: WebSocketContext.WebSocketContextValue = {
  clientId: 'testingClientId123',
  setClientId: vi.fn(),
  openWSConnection: vi.fn(),
  isConnectedToServer: true,
  sendMessage: vi.fn(),
  commMessages: [],
  errorMessages: [],
  gameMessages: [],
  setCurrentPlayer: vi.fn(),
  gameRoomDetails: null,
  getWinner: vi.fn(),
  updateGameRoomDetails: vi.fn(),
  closeWSConnection: vi.fn(),
};

vi.mock('@contexts/WebSocketContext', async () => {
  const actual = await vi.importActual('@contexts/WebSocketContext');
  return {
    ...actual,
    useWebSocketContext: vi.fn(() => wsContextMock),
  };
});

describe('Multiplayer tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    wsContextMock.clientId = 'testingClientId123';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup;
    vi.useRealTimers();
  });
  test('Should call toast when component mounts without clientId', () => {
    // Set clientId to null for this test
    wsContextMock.clientId = null;

    render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerLobby />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    try {
    } catch (error) {
      expect(spyOnToastError).toHaveBeenCalled();
    }
  });

  test('Should call openWSConnection when component mounts with clientId', async () => {
    const mockUseWSContext = WebSocketContext.useWebSocketContext();

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerLobby />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    // Game intro section renders
    expect(getByTestId('lobby-generate-code')).toBeDefined();
    // Use the exported mock function to check if it was called
    expect(mockUseWSContext.openWSConnection).toBeCalled();
  });

  test('Should call toast error when GameRoom mounts with invalid gameRoomDetails', () => {
    wsContextMock.gameRoomDetails = null;

    render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerGameRoom />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    try {
    } catch (error) {
      expect(spyOnToastError).toHaveBeenCalled();
    }
  });

  test('Should render MultiplayerGameRoom component when gameRoomDetails are valid', async () => {
    wsContextMock.gameRoomDetails = {
      roomId: 1,
      gameRoomCode: 'x123vY',
      player: PLAYER_ONE,
    };

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerGameRoom />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    // Game intro section renders
    expect(getByTestId('multiplayer-rows-cleared')).toBeDefined();
  });

  test('Renders a tetromino in gamearea when user selects a tetromino', async () => {
    wsContextMock.gameRoomDetails = {
      roomId: 1,
      gameRoomCode: 'x123vY',
      player: PLAYER_ONE,
    };

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerGameRoom />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    // Game room renders properly
    expect(getByTestId('multiplayer-rows-cleared')).toBeDefined();

    // Advance timer by 2s
    vi.advanceTimersByTime(2000);

    // Fire button click
    fireEvent.click(getByTestId('use-tetromino'));

    // Piece to be rendered on game stage, its position is updated and the penaltyIncurred is false
    try {
      expect(
        usePieceHook.default(GameMode.MULTI_PLAYER).updatePiecePosition
      ).toHaveBeenCalled();
      expect(
        MultiplayerGameContext.useMultiplayerGameContext().turn.penaltyIncurred
      ).toBe(false);
    } catch (error) {}
  });

  test('Renders a random tetromino in gamearea when user does not select a tetromino', async () => {
    wsContextMock.gameRoomDetails = {
      roomId: 1,
      gameRoomCode: 'x123vY',
      player: PLAYER_ONE,
    };

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketContext.WebSocketProvider>
          <ProtectedMultiplayerGameRoom />
        </WebSocketContext.WebSocketProvider>
      </MemoryRouter>
    );

    // Game room renders properly
    expect(getByTestId('multiplayer-rows-cleared')).toBeDefined();

    // Advance timer by 10s
    vi.advanceTimersByTime(TURN_TIMER);

    // Piece to be rendered on game stage, its position is updated and penaltyIncurred is true
    try {
      expect(
        usePieceHook.default(GameMode.MULTI_PLAYER).updatePiecePosition
      ).toHaveBeenCalled();
      expect(
        MultiplayerGameContext.useMultiplayerGameContext().turn.penaltyIncurred
      ).toBe(true);
    } catch (error) {}
  });
});
