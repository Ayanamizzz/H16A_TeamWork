import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
const ERROR = { error: expect.any(String) };

describe('adminUserDetails', () => {
  beforeEach(() => {
    // Clear the data store before each test if necessary
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  // Test each token Input.
  test.each([
    { token: 10 },
    { token: 12 },
    { token: 'me' },
    { token: '!2das@@3' },
  ])("invalid user ID : '$invalidID'", ({ token }) => {
    const response = request('GET', `${url}:${port}/v1/admin/user/details`, {
      json: {
        Token: token,
      },
    });
    //expect(response.statusCode).toStrictEqual(401);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Success: Returns user details for valid authentication', () => {
    // Create a new user.
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'HGindaHouse@hogwarts.com',
        password: 'Hocrux2387',
        nameFirst: 'Ginny',
        nameLast: 'Weasley',
      },
    });


    let userData = JSON.parse(response.body.toString());
    // Ensure that the data returns a user Id.
    expect(userData).toStrictEqual({
      token: expect.any(String),
    });

    // Log in as the new user.

    response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'HGindaHouse@hogwarts.com',
        password: 'Hocrux2387',
      },
    });

    userData = JSON.parse(response.body.toString());
    expect(userData).toStrictEqual({
      token: expect.any(String),
    });


    // Now, retrieve user details based on the logged-in user's ID.
    response = request('GET', `${url}:${port}/v1/admin/user/details`, {
      qs: {
        token: userData.token,
      },
    });
    expect(response.statusCode).toStrictEqual(200);
    const userDetails = JSON.parse(response.body.toString());

    // Assert that the returned user details match the expected details
    // Note: the number of successful logins should equal 2, because upon registering, that counts as logging in.
    expect(userDetails).toEqual({
      user: {
        userId: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      },
    });
  });
});

