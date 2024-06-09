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
import clientIdServer from './server';

describe('Multiplayer Client Id flow', () => {
  beforeAll(() => clientIdServer.listen());
  afterEach(() => clientIdServer.resetHandlers());
  afterAll(() => clientIdServer.close());

  test('local storage should not have a clientId initially', () => {
    expect(localStorage.getItem('clientId')).toBe(null);
  });

  test('API response should be of type JSON', async () => {
    const response = await fetchClientId();
    assertType<'json'>(response);
  });
});
