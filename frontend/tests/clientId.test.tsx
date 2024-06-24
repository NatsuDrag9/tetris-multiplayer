import {
  test,
  assertType,
  beforeAll,
  afterEach,
  describe,
  expect,
  vi,
} from 'vitest';
import { fireEvent, waitFor, cleanup } from '@testing-library/react';
import render from './setupTests';
import { fetchClientId } from '@services/multiPlayer';
import MultiplayerClientId from '@pages/MultiplayerClientId/MultiplayerClientId';
import { WebSocketProvider } from '@contexts/WebSocketContext';
import { MemoryRouter } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ENDPOINTS from '@constants/apiEndpoints';
import toast from 'react-hot-toast';

const mockAxios = new MockAdapter(axios);
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const spyOnToastError = vi.spyOn(toast, 'error');

describe('Multiplayer Client Id flow', () => {
  beforeAll(() => mockAxios.resetHandlers());
  afterEach(() => {
    mockAxios.resetHandlers();
    sessionStorage.clear();
    vi.restoreAllMocks();
    cleanup;
  });

  // Initial test
  test('Session storage should not have a clientId initially', () => {
    expect(sessionStorage.getItem('clientId')).toBeNull();
  });

  // Test for 200 API response
  test('Sucessful API response should be of type JSON', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).reply(200, {
      clientId: 'testingCliendId123',
    });
    const response = await fetchClientId();
    assertType<'json'>(response);
  });

  test('Set clientId in session storage on success API response', async () => {
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
      expect(sessionStorage.getItem('clientId')).toBe('testingClientId123');
    });
  });

  // Test for handling error API response
  test('Client Id is null and get-ticket button is rendered', async () => {
    // This statement is not required as sessionStorage.clear() removes "clienId" in afterEach
    // sessionStorage.removeItem('clientId');

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

  test('Test client Id API server error response', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).reply(500, {
      message: 'Error generating client ID',
    });

    try {
      await axios.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        expect(error.response.data.message).toBe('Error generating client ID');
        expect(error.response.status).toBe(500);
      }
    }
  });

  test('DOM update on client Id API server error response', async () => {
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

    expect(queryByTestId('get-ticket')).not.toBeNull();
    try {
      await fireEvent.click(getByTestId('get-ticket'));
    } catch (error) {
      expect(sessionStorage.getItem('clientId')).toBeNull();
      expect(queryByTestId('display-ticket')).toBeNull();
      expect(spyOnToastError).toHaveBeenCalledWith('Unexpected error occurred');
    }
  });

  test('Test client Id API network error response', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).networkError();

    /**
     * Both, the try-catch block and the await block work
     */

    // try {
    //   await axios.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`);
    // } catch (error) {
    //   if (error instanceof Error) {
    //     expect(error.message).toBe('Network Error');
    //   }
    // }

    await expect(
      axios.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`)
    ).rejects.toThrowError('Network Error');
  });

  test('Handles Client Id API network error response', async () => {
    mockAxios.onGet(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`).networkError();

    const { getByTestId, queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketProvider>
          <MultiplayerClientId />
        </WebSocketProvider>
      </MemoryRouter>
    );

    expect(queryByTestId('get-ticket')).not.toBeNull();

    try {
      await fireEvent.click(getByTestId('get-ticket'));
    } catch (error) {
      expect(sessionStorage.getItem('clientId')).toBeNull();
      expect(queryByTestId('display-ticket')).toBeNull();
      expect(spyOnToastError).toHaveBeenCalledWith(
        'Server is offline or unreachable'
      );
    }
  });
});
