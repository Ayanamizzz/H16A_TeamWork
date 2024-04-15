import request from 'sync-request-curl';
import config from '../config.json';
import { register } from './api';

const port = config.port;
const url = config.url;
const web = `${url}:${port}`;

function logoutTesting(token: string) {
  return request('POST', web + '/v1/admin/auth/logout', {
    json: {
      token: token,
    },
  });
}


describe('adminAuthLogout', () => {
  beforeEach(() => {
    request('DELETE', web + '/v1/clear', {});
  });

  // Test with valid token.
  test('Logout success: ', () => {
    const user = register(        
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin',
    )

    expect(user).toStrictEqual({
      token: expect.any(String),
    });
    
    const logoutResponse = logoutTesting(user.token);
    const logoutData = JSON.parse(logoutResponse.body.toString());
    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutData).toEqual({});

  });

  // Test with empty or invalid token.
  test('Error: Token is empty or invalid.', () => {
    const user = register(        
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin',
    )

    expect(user).toStrictEqual({
      token: expect.any(String),
    });
    const logoutResponse = logoutTesting('Invalid token');
    const logoutData = JSON.parse(logoutResponse.body.toString());
    expect(logoutResponse.statusCode).toBe(401);
    expect(logoutData).toEqual({ error: expect.any(String) });

  });
});
