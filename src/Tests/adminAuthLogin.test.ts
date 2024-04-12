// import { adminAuthLogin, adminAuthRegister } from "./auth";
import request from 'sync-request-curl';
import config from '../config.json';

// import { clear } from "./other.js";

const port = config.port;
const url = config.url;
const ERROR = { error: expect.any(String) };

describe('adminAuthLogin', () => {
  // everytime clear
  beforeEach(() => {
    // Clear data store when i do test;
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  test('Error: Email does not exist.', () => {
    // report any error

    const response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'sby1010284295@gmail.com',
        password: 'Wind4ever233',
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const returnData = JSON.parse(response.body.toString());
    expect(returnData).toStrictEqual(ERROR);
  });

  test('Error: Password is incorrect.', () => {
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'sby1010284295@gmail.com',
        password: 'wind4ever233qwq',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      },
    });

    let returnData = JSON.parse(response.body.toString());

    expect(returnData).toStrictEqual({
      token: expect.any(String),
    });

    // Login with a new user
    response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'sby1010284295@gmail.com',
        password: 'Lovelive123',
      },
    });

    returnData = JSON.parse(response.body.toString());
    expect(returnData).toStrictEqual(ERROR);
  });
});

describe('Successful check', () => {
  // everytime clear
  beforeEach(() => {
    // Clear data store when i do test;
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });
  // successful to check Password
  test('Success: Password is correct.', () => {
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'sby1010284295@gmail.com',
        password: 'Wind4ever233',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      },
    });

    let returnData = JSON.parse(response.body.toString());

    expect(returnData).toStrictEqual({
      token: expect.any(String),
    });

    // Login with a new user
    response = request('POST', `${url}:${port}/v1/admin/auth/login`, {
      json: {
        email: 'sby1010284295@gmail.com',
        password: 'Wind4ever233',
      },
    });
    expect(response.statusCode).toStrictEqual(200);
    returnData = JSON.parse(response.body.toString());
    expect(returnData).toStrictEqual({
      token: expect.any(String),
    });
  });
});
