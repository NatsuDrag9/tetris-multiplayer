import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import render from './setupTests';
import { cleanup } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as WebSocketContext from '@contexts/WebSocketContext';
import { ProtectedMultiplayerLobby } from '@pages/ProtectedPages/ProtectedPages';
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

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
  beforeAll(() => mockAxios.resetHandlers());
  beforeEach(() => {
    vi.clearAllMocks();
    wsContextMock.clientId = 'testingClientId123';
  });

  afterEach(() => {
    mockAxios.resetHandlers();
    sessionStorage.clear();
    vi.restoreAllMocks();
    cleanup;
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

    expect(spyOnToastError).toHaveBeenCalled();
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
});
