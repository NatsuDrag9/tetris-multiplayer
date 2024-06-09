import {
  test,
  assertType,
  beforeAll,
  afterEach,
  afterAll,
  describe,
  expect,
} from 'vitest';
import { fetchClientId } from '@services/multiPlayer';
import { logInTest } from '@utils/log-utils';
import { successfulClientIdServer, errorClientIdServer } from './server';

describe('Multiplayer Client Id flow', () => {
  beforeAll(() => successfulClientIdServer.listen());
  afterEach(() => successfulClientIdServer.resetHandlers());
  afterAll(() => {
    successfulClientIdServer.close();
    errorClientIdServer.close();
  });

  // Initial test
  test('local storage should not have a clientId initially', () => {
    expect(localStorage.getItem('clientId')).toBe(null);
  });

  // Test for 200 API response
  test('API response should be of type JSON', async () => {
    const response = await fetchClientId();
    logInTest(response);
    assertType<'json'>(response);
  });

  // Test for handling non-200 API response
  test('handles API error response', async () => {
    // Start the error server
    errorClientIdServer.listen();

    try {
      await fetchClientId();
    } catch (error) {
      expect(error).toBeTruthy();
      expect(localStorage.getItem('clientId')).toBe(null);
    } finally {
      // Reset the error server
      errorClientIdServer.resetHandlers();
    }
  });
});
