import {
  test,
  assertType,
  beforeAll,
  afterEach,
  describe,
  expect,
} from 'vitest';
import { fireEvent, waitFor, cleanup } from '@testing-library/react';
import render from './setupTests';
import { fetchClientId } from '@services/multiPlayer';
import { logInTest } from '@utils/log-utils';
import MultiplayerClientId from '@pages/MultiplayerClientId/MultiplayerClientId';
import { WebSocketProvider } from '@contexts/WebSocketContext';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ENDPOINTS from '@constants/apiEndpoints';

const mockAxios = new MockAdapter(axios);
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

describe('Multiplayer Client Id flow', () => {
  beforeAll(() => mockAxios.resetHandlers());
  afterEach(() => {
    mockAxios.resetHandlers();
    localStorage.clear();
    cleanup;
  });

  // Initial test
  test('local storage should not have a clientId initially', () => {
    expect(localStorage.getItem('clientId')).toBeNull();
  });

  // Test for 200 API response
  test('Sucessful API response should be of type JSON', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).reply(200, {
      clientId: 'testingCliendId123',
    });
    const response = await fetchClientId();
    logInTest(response);
    assertType<'json'>(response);
  });

  test('Set clientId in local storage on success API response', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).reply(200, {
      clientId: 'testingClientId123',
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketProvider>
          <MultiplayerClientId />
        </WebSocketProvider>
      </MemoryRouter>
    );

    fireEvent.click(getByTestId('get-ticket'));

    await waitFor(() => {
      expect(getByTestId('display-ticket').innerHTML).toMatch(
        'Your ticket: testingClientId123'
      );
      expect(localStorage.getItem('clientId')).toBe('testingClientId123');
    });
  });

  // Test for handling error API response
  test('Client Id is null and get-ticket button is rendered', async () => {
    // This statement is not required as localStorage.clear() removes "clienId" in afterEach
    // localStorage.removeItem('clientId');

    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketProvider>
          <MultiplayerClientId />
        </WebSocketProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(queryByTestId('get-ticket')).toBeDefined();
      expect(queryByTestId('display-ticket')).toBeNull();
    });
  });

  test('Handles Client Id API error response', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).reply(500, {
      message: 'Error generating client ID',
    });
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketProvider>
          <MultiplayerClientId />
        </WebSocketProvider>
      </MemoryRouter>
    );

    // Ensure 'get-ticket' is available and clickable
    await waitFor(() => {
      expect(queryByTestId('get-ticket')).not.toBeNull();
      fireEvent.click(getByTestId('get-ticket'));
    });

    await waitFor(() => {
      expect(localStorage.getItem('clientId')).toBeNull();
      expect(queryByTestId('display-ticket')).toBeNull();
    });
  });
});
