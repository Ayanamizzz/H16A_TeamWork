import config from '../config.json';
import request from 'sync-request-curl';

const port = config.port;
const url = config.url;

describe('Test successful adminUserDetailsUpdate', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}` + '/v1/clear', {});
  });

  test('Test successful case', () => {
    const user = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'MaJin@gmail.com',
        password: 'Wind4eevv',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      }
    });
    const token = JSON.parse(user.body.toString()).token;
    const response = request('PUT', `${url}:${port}/v1/admin/user/details`, {
      json: {
        token: token,
        email: 'JinMa@gmail.com',
        nameFirst: 'Jin',
        nameLast: 'Ma',
      }
    });

    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual({});
    expect(response.statusCode).toStrictEqual(200);
  });
});

describe('Test invalid input of adminUserDetailsUpdate', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}` + '/v1/clear', {});
  });

  test('Token is not a valid user', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/user/details`, {
      json: {
        token: '',
        email: 'Majin3321@gmail.com',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      },
    });
    const returnData = JSON.parse(response.body.toString());
    expect(returnData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(401);
  });

  test('Email is currently used by another user.', () => {
    const user = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Majin@gmail.com',
        password: 'Wind4eevv',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      },
    });

    request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'z5437798@gmail.com',
        password: 'LoveLive22',
        nameFirst: 'Jin',
        nameLast: 'Ma'
      },
    });
    const userToken = JSON.parse(user.body.toString()).token;

    const response = request('PUT', `${url}:${port}/v1/admin/user/details`, {
      json: {
        token: userToken,
        email: 'z5437798@gmail.com',
        nameFirst: 'Ma',
        nameLast: 'Jin',
      },
    });
    const data = JSON.parse(response.body.toString());
    expect(response.statusCode).toStrictEqual(400);
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('nameFirst is empty', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details', {
      json: {
        token: user1Token,
        email: 'z5437798@gmail.com',
        nameFirst: '',
        nameLast: 'Jin'
      },
    });
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('nameFirst is one character', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
      json: {
        email: 'z5437798@gmail.com',
        password: 'Wind4eevv',
        nameFirst: 'Ma',
        nameLast: 'Jin'
      }
    });

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'M',
          nameLast: 'Jin'
        },
      }
    );
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('nameFirst is 20 characters', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Wocaolenigeshabidongxidema',
          nameLast: 'Jin'
        },
      }
    );
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('nameLast is empty', () => {
    const user1 = request(
      'POST',
            `${url}:${port}` + '/v1/admin/auth/register',
            {
              json: {
                email: 'z5437798@gmail.com',
                password: 'Wind4eevv',
                nameFirst: 'Ma',
                nameLast: 'Jin'
              }
            }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: ''
        },
      }
    );
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('nameLast is one character', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: 'J'
        },
      }
    );
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('nameLast is 20 characters', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: 'Jinqewiqheiwqqwiejqi'
        },
      }
    );
    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({});
  });

  test.each([
    { invalidName: 'name1' },
    { invalidName: '...' },
    { invalidName: ':DD' },
    { invalidName: 'one+one=two' },
  ])(
    'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes error',
    ({ invalidName }) => {
      const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
        {
          json: {
            email: 'z5437798@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Ma',
            nameLast: 'Jin'
          }
        }
      );
      const user1Token = JSON.parse(user1.body.toString()).token;

      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
        {
          json: {
            token: user1Token,
            email: 'z5437798@gmail.com',
            nameFirst: 'Ma',
            nameLast: invalidName
          },
        }
      );

      const data = JSON.parse(res.body.toString());

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    }
  );

  test.each([
    { weirdName: '  --  ' },
    { weirdName: '     ' },
    { weirdName: "'-'-'-" },
  ])('Weird, but technically valid nameLast', ({ weirdName }) => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );
    const user1Token = JSON.parse(user1.body.toString()).token;

    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: weirdName
        },
      }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({});
  });
});

describe('PUT /v1/admin/user/details functionality', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}` + '/v1/clear', { qs: {} });
  });

  test('email is successfully updated', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        },
      }
    );

    const res = request('GET', `${url}:${port}` + '/v1/admin/user/details',
      {
        qs: {
          token: user1Token
        }
      }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Ma Jin',
        email: 'z5437798@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('email is successfully updated', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    request('PUT', `${url}:${port}` + '/v1/admin/user/details',
      {
        json: {
          token: user1Token,
          email: 'z5437798@gmail.com',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        },
      }
    );

    const res = request('GET', `${url}:${port}` + '/v1/admin/user/details',
      {
        qs: {
          token: user1Token
        }
      }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Ma Jin',
        email: 'z5437798@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('nameFirst is successfully updated', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    request(
      'PUT',
            `${url}:${port}` + '/v1/admin/user/details',
            {
              json: {
                token: user1Token,
                email: 'z5437798@gmail.com',
                nameFirst: 'Liu',
                nameLast: 'Jin'
              },
            }
    );

    const res = request('GET', `${url}:${port}` + '/v1/admin/user/details',
      {
        qs: {
          token: user1Token
        }
      }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Liu Jin',
        email: 'z5437798@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('nameLast is successfully updated', () => {
    const user1 = request('POST', `${url}:${port}` + '/v1/admin/auth/register',
      {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4eevv',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const user1Token = JSON.parse(user1.body.toString()).token;

    request(
      'PUT',
            `${url}:${port}` + '/v1/admin/user/details',
            {
              json: {
                token: user1Token,
                email: 'z5437798@gmail.com',
                nameFirst: 'Ma',
                nameLast: 'Liu'
              },
            }
    );

    const res = request(
      'GET',
            `${url}:${port}` + '/v1/admin/user/details',
            {
              qs: {
                token: user1Token
              }
            }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Ma Liu',
        email: 'z5437798@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
});
