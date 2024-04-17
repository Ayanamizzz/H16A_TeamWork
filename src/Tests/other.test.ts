import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

describe('test clear', () => {
  beforeEach(() => {
    // Clear the data store before each test if necessary
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  test('Success: test clear', () => {
    // Create a new user.
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'z5437798@gmail.com',
        password: 'Wind4ever',
        nameFirst: 'Ma',
        nameLast: 'Jin',
      },
    });
    response = request('DELETE', `${url}:${port}/v1/clear`, {});
    expect(response.statusCode).toStrictEqual(200);
    // Log in as the new user.

    response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'z5437798@gmail.com',
        password: 'Wind4ever',
      },
    });
    expect(response.statusCode).toStrictEqual(400);
  });
});
