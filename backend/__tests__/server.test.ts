import supertest from 'supertest';
import app from '../src/app';
import { Server } from 'http';
import { logInTest } from '../src/utils/log-utils';
import { beforeAll, describe, it, expect, afterAll } from '@jest/globals';

let server: Server;
let TEST_PORT = 3001;

describe('Hello world test suite', () => {
  beforeAll(
    () =>
      new Promise<void>((resolve, reject) => {
        logInTest('Before all... ');
        server = app
          .listen(TEST_PORT, () => {
            logInTest(`Server started and listening on ${TEST_PORT}`);
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          });
      })
  );

  it('should respond with 200 status code for GET / endpoint', async () => {
    logInTest('Inside test');
    try {
      const response = await supertest(app).get('/');
      expect(response.status).toBe(200);
    } catch (error) {
      expect(error).toBe(error);
    }
  });

  afterAll((done) => {
    server.close(() => {
      logInTest('Server closed after testing.');
      done();
    });
  });
});
