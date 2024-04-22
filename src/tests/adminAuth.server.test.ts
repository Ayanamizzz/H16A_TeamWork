import { port, url } from './../config.json';
const SERVER_URL = `${url}:${port}`;
import { clear } from './other';

import {
  deleteReq,
  detailsReq,
  logoutReq,
  registerReq,
  loginReq,
  passwordUpdateReq,
  updateDetailsReq
} from './api';

// Commenting to remove linting error but if necessary can find and use again
// const passwordUpdate = (token: number, oldPassword: string, newPassword: string) => {
// return { token: token, oldPassword: oldPassword, newPassword: newPassword };
// };

beforeEach(() => {
  clear();
});

/*
Error tests for adminAuthRegister(email, password, nameFirst, nameLast):
- Duplicate Emails
- Invalid Emails
- nameFirst contains characters other than letters, spaces, hyphens, or apostrophes
- nameFirst is outside the 2 - 20 character boundary
- nameLast contains characters other than letters, spaces, hyphens, or apostrophes
- nameLast is outside the 2 - 20 character boundary
- password is less than 8 characters
- password does not contain at least one number and at least one letter
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('POST/v1/admin/auth/register', () => {
  describe('Success Cases', () => {
    test('Inputs have a variety of characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden-is-good', 'Wi-bo-wo');
      expect(newToken).toEqual({ token: expect.any(String) });
    });
  });
  describe('Error Cases', () => {
    test('adminAuthRegister takes in a duplicate email', () => {
      registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      const newToken2 = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      expect(newToken2).toStrictEqual({ error: 'email has already been registered' });
    });
    test('Non-valid email inputted', () => {
      const newToken = registerReq('123', 'Password12345678', 'Hayden', 'HaydenTest');
      expect(newToken).toEqual({ error: 'email is invalid' });
    });
    test('nameFirst contains invalid characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Cyr1l!!', 'HaydenTest');
      expect(newToken).toEqual({ error: 'nameFirst must only contain letters, spaces, hyphens, or apostrophes' });
    });
    test('nameFirst is less than 2 characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'C', 'HaydenTest');
      expect(newToken).toEqual({ error: 'nameFirst must be longer than 2 characters' });
    });
    test('nameFirst is more than 20 characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'c'.repeat(21), 'HaydenTest');
      expect(newToken).toEqual({ error: 'nameFirst cannot be longer than 20 characters' });
    });
    test('nameLast contains invalid characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'Wib0w0!!');
      expect(newToken).toEqual({ error: 'nameLast must only contain letters, spaces, hyphens, or apostrophes' });
    });
    test('nameLast is less than 2 characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'W');
      expect(newToken).toEqual({ error: 'nameLast must be longer than 2 characters' });
    });
    test('nameLast is more than 20 characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'w'.repeat(21));
      expect(newToken).toEqual({ error: 'nameLast cannot be longer than 20 characters' });
    });
    test('password is less than 8 characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'I', 'Hayden', 'HaydenTest');
      expect(newToken).toEqual({ error: 'password must be longer than 8 characters' });
    });
    test('password does not contain any letters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', '123456789', 'Hayden', 'HaydenTest');
      expect(newToken).toEqual({ error: 'password must contain at least 1 letter' });
    });
    test('password does not contain any numbers', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'abcdefghi', 'Hayden', 'HaydenTest');
      expect(newToken).toEqual({ error: 'password must contain at least 1 number' });
    });
    test('All inputs are empty strings', () => {
      const newToken = registerReq('', '', '', '');
      expect(newToken).toEqual({ error: 'email is invalid' });
    });
  });
});

/*
Error tests for adminAuthLogin(email, password):
- email does not exist
- password is not correct for given email
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('POST/v1/admin/auth/login', () => {
  describe('Success Cases', () => {
    test('correct output with one register', () => {
      registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const loginToken = loginReq('hayden@unsw.edu.au', 'Password45678');
      expect(loginToken).toStrictEqual({ token: expect.any(String) });
    });
    test('correct output with multiple registers', () => {
      registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      registerReq('cat1@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      registerReq('cat2@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      const loginToken = loginReq('hayden@unsw.edu.au', 'Password45678');
      expect(loginToken).toStrictEqual({ token: expect.any(String) });
    });
  });
  describe('Error Cases', () => {
    test('call without any register', () => {
      const loginToken = loginReq('hayden@unsw.edu.au', 'Password45678');
      expect(loginToken).toStrictEqual({ error: 'email does not exist' });
    });
    test('enter non existing email after register', () => {
      registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const loginToken = loginReq('cat1@email.com', 'Password45678');
      expect(loginToken).toStrictEqual({ error: 'email does not exist' });
    });
    test('enter wrong password after register', () => {
      registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const loginToken = loginReq('hayden@unsw.edu.au', 'ILoveC3');
      expect(loginToken).toStrictEqual({
        error: 'password was incorrect for given email'
      });
    });
  });
});

describe('GET/v2/admin/user/details', () => {
  describe('Error Cases', () => {
    test('Error when token is not valid', () => {
      const result = detailsReq();
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Token is valid but for a logged in session', () => {
      const result = detailsReq('999');
      expect(result.error).toStrictEqual(expect.any(String));
    });
  });
  describe('Success Cases', () => {
    test('Provides correct details for a new user', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'ILikeC4t', 'Hayden', 'HaydenTest');
      const userDetails = detailsReq(newToken.token);
      expect(userDetails).toStrictEqual({
        user:
          {
            userId: expect.any(Number),
            name: 'Hayden HaydenTest',
            email: 'hayden@unsw.edu.au',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0
          }
      });
    });
    test('Provides correct details for one user that has some failed and successful logins', () => {
      const newToken = registerReq('hello@gmail.com', 'paSword123', 'Magnus', 'Carlson');

      // Creates 2 unsuccessful logins
      for (let i = 0; i < 2; i++) {
        loginReq('hello@gmail.com', 'paSssssword123');
      }

      // Creates 5 successful logins
      for (let i = 0; i < 5; i++) {
        loginReq('hello@gmail.com', 'paSword123');
      }

      // Creates 2 unsuccessful logins
      for (let i = 0; i < 2; i++) {
        loginReq('hello@gmail.com', 'incorrectpassword');
      }

      const userDetails = detailsReq(newToken.token);
      expect(userDetails).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Magnus Carlson',
          email: 'hello@gmail.com',
          numSuccessfulLogins: 6,
          numFailedPasswordsSinceLastLogin: 2
        }
      });
    });

    test('Provides correct details for one user that has some failed and successful logins', () => {
      const newToken1 = registerReq('hello@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const newToken2 = registerReq('tester@outlook.com', 'iPromise5', 'Stephen', 'Curry');

      // Creates 2 unsuccessful logins
      for (let i = 0; i < 2; i++) {
        loginReq('hello@gmail.com', 'paSssssword123');
      }

      // Creates 5 successful logins
      for (let i = 0; i < 5; i++) {
        loginReq('hello@gmail.com', 'paSword123');
      }

      // Creates 2 unsuccessful logins
      for (let i = 0; i < 2; i++) {
        loginReq('hello@gmail.com', 'incorrectpassword');
      }

      const userDetails1 = detailsReq(newToken1.token);
      const userDetails2 = detailsReq(newToken2.token);

      expect(userDetails1).toStrictEqual({
        user:
          {
            userId: expect.any(Number),
            name: 'Magnus Carlson',
            email: 'hello@gmail.com',
            numSuccessfulLogins: 6,
            numFailedPasswordsSinceLastLogin: 2
          }
      });

      expect(userDetails2).toStrictEqual({
        user:
          {
            userId: expect.any(Number),
            name: 'Stephen Curry',
            email: 'tester@outlook.com',
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0
          }
      });
    });
  });
});

describe('POST/v2/admin/auth/logout', () => {
  describe('Success Cases', () => {
    test('Logout with one register', () => {
      const newToken = registerReq('hello@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const logout = logoutReq(newToken.token);
      expect(logout).toStrictEqual({});
    });
  });

  describe('Error Cases', () => {
    test('Error when token is not valid', () => {
      const result = logoutReq();
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Token is for a user who has already logged out', () => {
      const result = logoutReq('999');
      expect(result.error).toStrictEqual(expect.any(String));
    });
  });
});

describe('PUT/v2/admin/user/password', () => {
  describe('Success Cases', () => {
    test('Update password', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const update = passwordUpdateReq('yang123456', 'newpass123456', newToken.token);
      expect(update).toStrictEqual({});
    });
  });
  describe('Error Cases', () => {
    test('Error when token is not valid', () => {
      const result = passwordUpdateReq('yang1234568', 'newpass123456');
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Token is for a user who has already logged out', () => {
      const result = passwordUpdateReq('yang1234568', 'newpass123456', '9999');
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Old Password is not the correct old password', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const result = passwordUpdateReq('yang1234568', 'newpass123456', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('New Password has already been used before by this user', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const update1 = passwordUpdateReq('yang123456', 'yang12345678', newToken.token);
      expect(update1).toStrictEqual({});
      const result = passwordUpdateReq('yang12345678', 'yang123456', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('password must be longer than 8 characters', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const result = passwordUpdateReq('yang123456', 'newp1', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('password must contain at least 1 letter', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const result = passwordUpdateReq('yang123456', '123456789', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('password must contain at least 1 number', () => {
      const newToken = registerReq('yang@gmail.com', 'yang123456', 'young', 'yang');
      const result = passwordUpdateReq('yang123456', 'abcderdett', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
  });
});

describe('PUT/v2/admin/user/details', () => {
  describe('Success Cases', () => {
    test('Update nameFirst', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const update = updateDetailsReq('yangkai@gmail.com', 'yang', 'Carlson', newToken.token);
      expect(update).toStrictEqual({});
    });
  });
  describe('Error Cases', () => {
    test('Error when token is not valid', () => {
      const result = updateDetailsReq('yangkai@gmail.com', 'yang', 'Carlson');
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Token is valid but for a logged in session', () => {
      const result = updateDetailsReq('yangkai@gmail.com', 'yang', 'Carlson', '999');
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Email is not valid', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('esgi8-412', 'yang', 'Carlson', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('Email is currently used by another user (excluding the current authorised user)', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      registerReq('kai@gmail.com', 'paSword123', 'what', 'ever');
      const result = updateDetailsReq('kai@gmail.com', 'yang', 'Carlson', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'yang##', 'Carlson', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameFirst is less than 2 characters', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'y', 'Carlson', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameFirst is more than 20 characters', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'yangawdasdwadwadsawdawdawdasdwa', 'Carlson', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'yang', 'Carlson##', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameLast is less than 2 characters', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'yang', 'C', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
    test('NameLast is more than 20 characters', () => {
      const newToken = registerReq('yang@gmail.com', 'paSword123', 'Magnus', 'Carlson');
      const result = updateDetailsReq('kai@gmail.com', 'yang', 'Carlsonwadadwadsadwadasdwadsaw', newToken.token);
      expect(result.error).toStrictEqual(expect.any(String));
    });
  });
});

describe('clear', () => {
  test('clear', () => {
    const result = deleteReq(`${SERVER_URL}/v1/clear`, {});
    expect(result).toStrictEqual({});
  });
});

afterAll(() => {
  clear();
});
