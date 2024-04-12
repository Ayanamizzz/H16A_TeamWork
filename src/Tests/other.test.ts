import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
// const ERROR = { error: expect.any(String) };

describe('test clear', () => {
  beforeEach(() => {
    // Clear the data store before each test if necessary
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  test('Success: test clear', () => {
    // Create a new user.
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'HGindaHouse@hogwarts.com',
        password: 'Hocrux2387',
        nameFirst: 'Ginny',
        nameLast: 'Weasley',
      },
    });
    response = request('DELETE', `${url}:${port}/v1/clear`, {});
    expect(response.statusCode).toStrictEqual(200);
    // Log in as the new user.

    response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'HGindaHouse@hogwarts.com',
        password: 'Hocrux2387',
      },
    });
    expect(response.statusCode).toStrictEqual(400);
  });
});
