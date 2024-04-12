import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
const web = `${url}:${port}`;

describe('adminAuthLogout', () => {
  beforeEach(() => {
    request('DELETE', web + '/v1/clear', {});
  });

  // Test with valid token.
  test('Logout success: ', () => {
    // Create a new user.
    const response = request('POST', web + '/v1/admin/auth/register', {
      json: {
        email: 'z5437798@gmail.com',
        password: 'Wind4ever',
        nameFirst: 'Ma',
        nameLast: 'Jin',
      },
    });

    const data = JSON.parse(response.body.toString());
    const token = data.token;

    const logoutResponse = request('POST', web + '/v1/admin/auth/logout', {
      json: {
        token: token
      },
    });

    const logoutData = JSON.parse(logoutResponse.body.toString());
    expect(logoutData).toEqual({});
    expect(logoutResponse.statusCode).toBe(200);
  });

  // Test with empty or invalid token.
  test('Error: Token is empty or invalid.', () => {
    const response = request('POST', web + '/v1/admin/auth/logout', {
      json: {
        token: 'fake token'
      }
    });
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(401);
  });
});
