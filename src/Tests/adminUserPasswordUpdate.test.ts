import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

describe('PUT /v1/admin/user/password tests', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}`+ '/v1/clear', {});
  });

  test('PUT /v1/admin/user/password success', () => {
    const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4vvee',
          nameFirst: 'Ma',
          nameLast: 'Jin'
        }
      }
    );

    const token = JSON.parse(user.body.toString()).token;
    const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
        json: {
          token: token,
          oldPassword: 'Wind4vvee',
          newPassword: 'LoveLive742'
        },
      }
    );

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ });
    expect(res.statusCode).toStrictEqual(200);
  });

  describe('PUT /v1/admin/user/details error cases', () => {
    beforeEach(() => {
      request('DELETE', `${url}:${port}` + '/clear', {});
    });

    test('Token is empty or invalid', () => {
      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: '1',
            oldPassword: 'Wind4eevv',
            newPassword: 'Wind4eevv',
          },
        }
      );
      const data = JSON.parse(res.body.toString());

      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(401);
    });

    test('Old password is not the correct old password error', () => {
      const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
          json: {
            email: 'z5437798@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Ma',
            nameLast: 'Jin'
          }
        }
      );

      const token = JSON.parse(user.body.toString()).token;
      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'NishiSb1',
            newPassword: 'Nizhendeshi1'
          },
        }
      );

      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('Old password and new password match exactly error', () => {
      const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
          json: {
            email: 'z5437798@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Bill',
            nameLast: 'Gates'
          }
        }
      );

      const token = JSON.parse(user.body.toString()).token;
      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'Wind4eevv',
            newPassword: 'Wind4eevv'
          },
        }
      );

      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('New password has already been used before by this user error', () => {
      const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
          json: {
            email: 'MajinLoveyou@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Ma',
            nameLast: 'Jin'
          }
        }
      );

      const token = JSON.parse(user.body.toString()).token;
      request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'Wind4eevv',
            newPassword: 'newPassw0rd'
          },
        }
      );

      request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'newPassw0rd',
            newPassword: 'Chaojisb1'
          },
        }
      );

      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'Chaojisb1',
            newPassword: 'Wind4eevv'
          },
        }
      );

      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('7 character password', () => {
      const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
          json: {
            email: 'z5437798@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Ma',
            nameLast: 'Jin'
          }
        }
      );

      const token = JSON.parse(user.body.toString()).token;

      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'Wind4eevv',
            newPassword: 'Wind4ee'
          },
        }
      );

      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ error: expect.any(String) });
      expect(res.statusCode).toStrictEqual(400);
    });

    test('8 character password', () => {
      const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
          json: {
            email: 'Majin@gmail.com',
            password: 'Wind4eevv',
            nameFirst: 'Ma',
            nameLast: 'Jin'
          }
        }
      );

      const token = JSON.parse(user.body.toString()).token;

      const res = request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
          json: {
            token: token,
            oldPassword: 'Wind4eevv',
            newPassword: 'owie2wew'
          },
        }
      );

      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ });
    });

    test.each([
      { invalidPassword: 'invalidpassword' },
      { invalidPassword: '12345678' },
    ])(
      'New Password does not contain at least one number and at least one letter error',
      ({ invalidPassword }) => {
        const user = request(
          'POST',
          `${url}:${port}` + '/v1/admin/auth/register',
          {
            json: {
              email: 'z5437798@gmail.com',
              password: 'Wind4vvwe',
              nameFirst: 'Ma',
              nameLast: 'Jin'
            }
          }
        );

        const token = JSON.parse(user.body.toString()).token;

        const res = request(
          'PUT',
          `${url}:${port}` + '/v1/admin/user/password',
          {
            json: {
              token: token,
              oldPassword: 'passw0rd',
              newPassword: invalidPassword
            },
          }
        );

        const data = JSON.parse(res.body.toString());
        expect(data).toStrictEqual({ error: expect.any(String) });
        expect(res.statusCode).toStrictEqual(400);
      }
    );
  });
});

describe('adminUserPasswordUpdate functionality', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}` + '/v1/clear', {});
  });
  test('adminUserPasswordUpdate functionality', () => {
    const user = request('POST', `${url}:${port}` + '/v1/admin/auth/register', {
        json: {
          email: 'harrypotter@gmail.com',
          password: 'passw0rd',
          nameFirst: 'Harry',
          nameLast: 'Potter'
        }
      }
    );

    const token = JSON.parse(user.body.toString()).token;
    request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
        json: {
          token: token,
          oldPassword: 'passw0rd',
          newPassword: 'newPassw0rd'
        },
      }
    );

    request('PUT', `${url}:${port}` + '/v1/admin/user/password', {
        json: {
          token: token,
          oldPassword: 'newPassw0rd',
          newPassword: 'letmein123'
        },
      }
    );

    const res = request('POST',`${url}:${port}` + '/v1/admin/auth/login', {
        json: {
          email: 'harrypotter@gmail.com',
          password: 'letmein123'
        },
      }
    );

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ token: expect.any(String) });
  });
});
