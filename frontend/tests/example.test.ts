// sum.test.js
import { expect, test } from 'vitest';
import { sum } from '@utils/sum';
import { logInTest } from '@utils/log-utils';

test('adds 1 + 2 to equal 3', () => {
  logInTest('Running test...');
  expect(sum(1, 2)).toBe(3);
});
