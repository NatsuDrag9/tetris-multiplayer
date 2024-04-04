import { expect, test } from 'vitest';
import { logInTest } from '../src/utils/log-utils';

test('Example Test', () => {
  logInTest('Running an example test...');
  const result = 2 + 2;
  expect(result).toBe(4);
});
