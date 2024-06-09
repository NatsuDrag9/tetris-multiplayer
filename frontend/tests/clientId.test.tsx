import {
  test,
  assertType,
  beforeAll,
  afterEach,
  afterAll,
  describe,
  expect,
} from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { fetchClientId } from '@services/multiPlayer';
import { logInTest } from '@utils/log-utils';
import { successfulClientIdServer, errorClientIdServer } from './server';
import MultiplayerClientId from '@pages/MultiplayerClientId/MultiplayerClientId';
import { WebSocketProvider } from '@contexts/WebSocketContext';
import { MemoryRouter } from 'react-router-dom';

describe('Multiplayer Client Id flow', () => {
  beforeAll(() => successfulClientIdServer.listen());
  afterEach(() => {
    successfulClientIdServer.resetHandlers();
    errorClientIdServer.resetHandlers();
    localStorage.removeItem('clientId');
  });
  afterAll(() => {
    successfulClientIdServer.close();
    errorClientIdServer.close();
  });

  // Initial test
  test('local storage should not have a clientId initially', () => {
    expect(localStorage.getItem('clientId')).toBe(null);
  });

  // Test for 200 API response
  test('Sucessful API response should be of type JSON', async () => {
    const response = await fetchClientId();
    logInTest(response);
    assertType<'json'>(response);
  });

  test('Set clientId in local storage on success API response', async () => {
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
    });

    expect(localStorage.getItem('clientId')).toBe('testingClientId123');
  });

  // Test for handling non-200 API response
  test('Handles Cliend Id API error response', async () => {
    // Start the error server
    errorClientIdServer.listen();

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <WebSocketProvider>
          <MultiplayerClientId />
        </WebSocketProvider>
      </MemoryRouter>
    );

    fireEvent.click(getByTestId('get-ticket'));

    await waitFor(() => {
      expect(localStorage.getItem('clientId')).toBe(null);
    });
  });
});
