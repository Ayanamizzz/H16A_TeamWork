import { adminAuthRegister, adminAuthLogin, adminUserDetails } from './../auth';
import { clear } from './other';

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
describe('adminAuthRegister', () => {
  describe('Success Cases', () => {
    test('Inputs are on the lower bound of character lengths', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'ILikeC4t', 'Cy', 'Wi');
      expect(newUserCaseId).toEqual({ authUserId: expect.any(Number) });
    });
    test('Inputs are on the upper bound of character lengths', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      expect(newUserCaseId).toEqual({ authUserId: expect.any(Number) });
    });
    test('Inputs have a variety of characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden-is-good', 'Wi-bo-wo');
      expect(newUserCaseId).toEqual({ authUserId: expect.any(Number) });
    });
  });
  describe('Error Cases', () => {
    test('adminAuthRegister takes in a duplicate email', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      const newUserCaseId2 = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      expect(newUserCaseId2).toEqual({
        error: 'email has already been registered'
      });
    });
    test('Non-valid email inputted', () => {
      const newUserCaseId = adminAuthRegister('123', 'Password12345678', 'Hayden', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'email is invalid'
      });
    });
    test('nameFirst contains invalid characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Cyr1l!!', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'nameFirst must only contain letters, spaces, hyphens, or apostrophes'
      });
    });
    test('nameFirst is less than 2 characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'C', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'nameFirst must be longer than 2 characters'
      });
    });
    test('nameFirst is more than 20 characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'HaydenHaydenHaydenHaydenHaydenC', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'nameFirst cannot be longer than 20 characters'
      });
    });
    test('nameLast contains invalid characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'Wib0w0!!');
      expect(newUserCaseId).toEqual({
        error: 'nameLast must only contain letters, spaces, hyphens, or apostrophes'
      });
    });
    test('nameLast is less than 2 characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'W');
      expect(newUserCaseId).toEqual({
        error: 'nameLast must be longer than 2 characters'
      });
    });
    test('nameLast is more than 20 characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTestHaydenTestHaydenTestHaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'nameLast cannot be longer than 20 characters'
      });
    });
    test('password is less than 8 characters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'I', 'Hayden', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'password must be longer than 8 characters'
      });
    });
    test('password does not contain any letters', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', '123456789', 'Hayden', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'password must contain at least 1 letter'
      });
    });
    test('password does not contain any numbers', () => {
      const newUserCaseId = adminAuthRegister('hayden@unsw.edu.au', 'abcdefghi', 'Hayden', 'HaydenTest');
      expect(newUserCaseId).toEqual({
        error: 'password must contain at least 1 number'
      });
    });
    test('Priority list of errors', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password12345678', 'Hayden', 'HaydenTest');
      let newUserCaseId2 = adminAuthRegister('hayden@unsw.edu.au', '!', '!', '!');
      expect(newUserCaseId2).toEqual({
        error: 'email has already been registered'
      });
      newUserCaseId2 = adminAuthRegister('123', '!', '!', '!');
      expect(newUserCaseId2).toEqual({
        error: 'email is invalid'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', '!', '!');
      expect(newUserCaseId2).toEqual({
        error: 'nameFirst must only contain letters, spaces, hyphens, or apostrophes'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'A', '!');
      expect(newUserCaseId2).toEqual({
        error: 'nameFirst must be longer than 2 characters'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'HaydenHaydenHaydenHaydenC', '!');
      expect(newUserCaseId2).toEqual({
        error: 'nameFirst cannot be longer than 20 characters'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'Hayden', '!');
      expect(newUserCaseId2).toEqual({
        error: 'nameLast must only contain letters, spaces, hyphens, or apostrophes'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'Hayden', 'A');
      expect(newUserCaseId2).toEqual({
        error: 'nameLast must be longer than 2 characters'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'Hayden', 'HaydenTestHaydenTestHaydenTestHaydenTest!');
      expect(newUserCaseId2).toEqual({
        error: 'nameLast must only contain letters, spaces, hyphens, or apostrophes'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'Hayden', 'HaydenTestHaydenTestHaydenTestHaydenTest');
      expect(newUserCaseId2).toEqual({
        error: 'nameLast cannot be longer than 20 characters'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!', 'Hayden', 'HaydenTest');
      expect(newUserCaseId2).toEqual({
        error: 'password must be longer than 8 characters'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!!!!!!!!', 'Hayden', 'HaydenTest');
      expect(newUserCaseId2).toEqual({
        error: 'password must contain at least 1 letter'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!!!!!!!!A', 'Hayden', 'HaydenTest');
      expect(newUserCaseId2).toEqual({
        error: 'password must contain at least 1 number'
      });
      newUserCaseId2 = adminAuthRegister('cat2@email.com', '!!!!!!!!A1', 'Hayden', 'HaydenTest');
      // Check there are no errors after user has fixed all details
      expect(newUserCaseId2).toEqual({ authUserId: expect.any(Number) });
    });
    test('All inputs are empty strings', () => {
      const newUserId = adminAuthRegister('', '', '', '');
      expect(newUserId).toEqual({
        error: 'email is invalid'
      });
    });
    test('Only email is an empty string', () => {
      const newUserId = adminAuthRegister('', 'ILoveCats!123', 'Hayden', 'HaydenTest');
      expect(newUserId).toEqual({
        error: 'email is invalid'
      });
    });
    test('Only password is an empty string', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', '', 'Hayden', 'HaydenTest');
      expect(newUserId).toEqual({
        error: 'password must be longer than 8 characters'
      });
    });
    test('Only nameFirst is an empty string', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', 'ILoveCats!123', '', 'HaydenTest');
      expect(newUserId).toEqual({
        error: 'nameFirst must be longer than 2 characters'
      });
    });
    test('Only nameLast is an empty string', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', 'ILoveCats!123', 'Hayden', '');
      expect(newUserId).toEqual({
        error: 'nameLast must be longer than 2 characters'
      });
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
describe('adminAuthLogin', () => {
  describe('Success Cases', () => {
    test('correct output with one register', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('hayden@unsw.edu.au', 'Password45678')).toStrictEqual(newUserId);
    });
    test('correct output with multiple registers', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      adminAuthRegister('cat1@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      adminAuthRegister('cat2@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('hayden@unsw.edu.au', 'Password45678')).toStrictEqual(newUserId);
    });
  });
  describe('Error Cases', () => {
    test('call without any register', () => {
      expect(adminAuthLogin('hayden@unsw.edu.au', 'Password45678')).toStrictEqual({
        error: 'email does not exist'
      });
    });
    test('enter non existing email after register', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('cat2@email.com', 'Password45678')).toStrictEqual({
        error: 'email does not exist'
      });
    });
    test('enter wrong password after register', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('hayden@unsw.edu.au', 'ILoveCats')).toStrictEqual({
        error: 'password was incorrect for given email'
      });
    });
    test('email is empty string', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('', 'ILoveCats')).toStrictEqual({
        error: 'email does not exist'
      });
    });
    test('password is empty string', () => {
      adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('hayden@unsw.edu.au', '')).toStrictEqual({
        error: 'password was incorrect for given email'
      });
    });
    test('test error priority', () => {
      const newUserId = adminAuthRegister('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      expect(adminAuthLogin('', '')).toStrictEqual({
        error: 'email does not exist'
      });
      expect(adminAuthLogin('hayden@unsw.edu.au', '')).toStrictEqual({
        error: 'password was incorrect for given email'
      });
      expect(adminAuthLogin('hayden@unsw.edu.au', 'Password45678')).toStrictEqual(newUserId);
    });
  });
});

// Note tests are dependent on adminAuthRegister and adminAuthLogin working 100%
describe('tests for adminUserDetails', () => {
  test('Provides correct details for a new user', () => {
    const user2 = adminAuthRegister('tester@outlook.com', 'iPromise5', 'Stephen', 'Curry');
    expect(adminUserDetails(user2.authUserId)).toStrictEqual({
      user:
        {
          userId: user2.authUserId,
          name: 'Stephen Curry',
          email: 'tester@outlook.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0
        }
    });
  });

  test('Provides correct details for one user that has some failed and successful logins', () => {
    const user1 = adminAuthRegister('hello@gmail.com', 'paSword123', 'Magnus', 'Carlson');

    // Creates 2 unsuccessful logins
    for (let i = 0; i < 2; i++) {
      adminAuthLogin('hello@gmail.com', 'paSssssword123');
    }

    // Creates 5 successful logins
    for (let i = 0; i < 5; i++) {
      adminAuthLogin('hello@gmail.com', 'paSword123');
    }

    // Creates 2 unsuccessful logins
    for (let i = 0; i < 2; i++) {
      adminAuthLogin('hello@gmail.com', 'incorrectpassword');
    }

    expect(adminUserDetails(user1.authUserId)).toStrictEqual({
      user:
        {
          userId: user1.authUserId,
          name: 'Magnus Carlson',
          email: 'hello@gmail.com',
          numSuccessfulLogins: 6,
          numFailedPasswordsSinceLastLogin: 2
        }
    });
  });

  test('Provides correct details for one user that has some failed and successful logins', () => {
    const user1 = adminAuthRegister('hello@gmail.com', 'paSword123', 'Magnus', 'Carlson');
    const user2 = adminAuthRegister('tester@outlook.com', 'iPromise5', 'Stephen', 'Curry');

    // Creates 2 unsuccessful logins
    for (let i = 0; i < 2; i++) {
      adminAuthLogin('hello@gmail.com', 'paSssssword123');
    }

    // Creates 5 successful logins
    for (let i = 0; i < 5; i++) {
      adminAuthLogin('hello@gmail.com', 'paSword123');
    }

    // Creates 2 unsuccessful logins
    for (let i = 0; i < 2; i++) {
      adminAuthLogin('hello@gmail.com', 'incorrectpassword');
    }

    expect(adminUserDetails(user1.authUserId)).toStrictEqual({
      user:
        {
          userId: user1.authUserId,
          name: 'Magnus Carlson',
          email: 'hello@gmail.com',
          numSuccessfulLogins: 6,
          numFailedPasswordsSinceLastLogin: 2
        }
    });

    expect(adminUserDetails(user2.authUserId)).toStrictEqual({
      user:
        {
          userId: user2.authUserId,
          name: 'Stephen Curry',
          email: 'tester@outlook.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0
        }
    });
  });
});

afterAll(() => {
  clear();
});
