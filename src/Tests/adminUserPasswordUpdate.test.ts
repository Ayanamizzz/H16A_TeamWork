import {
    adminAuthRegister,
    adminUserPasswordUpdate,
    adminAuthLogin,
  } from '../auth';
  
  import { clear } from '../other';
  
  describe('adminUserPasswordUpdate error cases', () => {
    beforeEach(() => {
      clear();
    });
  
    test('Token is not a valid token error', () => {
      expect(
        adminUserPasswordUpdate('1', 'falsePassword0', 'truePassword0')
      ).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Old password is not the correct old password error', () => {
      const result = adminAuthRegister(
        'z5437798@gmail.com',
        'windORer',
        'Ma',
        'Jin'
      );
      // The assertion is required because typescript will complain about being unable to determine the returning object type. Is it an object with userAuthId? Or an error message?
      const user1 = (result as { token: string }).token;
      expect(
        adminUserPasswordUpdate(user1, 'falsePassword0', 'truePassword0')
      ).toStrictEqual({ error: expect.any(String) });
    });
  
    test('Old password and new password match exactly error', () => {
      const result = adminAuthRegister(
        'z5437798@gmail.com',
        'windORer',
        'Ma',
        'Jin'
      );
      const user1 = (result as { token: string }).token;
      expect(
        adminUserPasswordUpdate(user1, 'windORer', 'windORer')
      ).toStrictEqual({ error: expect.any(String) });
    });
  
    test('New password has already been used before by this user error', () => {
      const result = adminAuthRegister(
        'z5437798@gmail.com',
        'windORer',
        'Ma',
        'Jin'
      );
      const user = (result as { token: string }).token;
      adminUserPasswordUpdate(user, 'windORer', 'newwindORer');
      adminUserPasswordUpdate(user, 'newwindORer', 'Iwant233');
      expect(
        adminUserPasswordUpdate(user, 'Iwant233', 'windORer')
      ).toStrictEqual({ error: expect.any(String) });
    });
  
    test('7 character password', () => {
      const result = adminAuthRegister(
        'z5437798@gmail.com',
        'windORe',
        'Ma',
        'Jin'
      );
      const user1 = (result as { token: string }).token;
      expect(adminUserPasswordUpdate(user1, 'windORe', 'IwantDr')).toStrictEqual(
        { error: expect.any(String) }
      );
    });
  
    test('8 character password', () => {
      const user = adminAuthRegister(
        'z5437798@gmail.com',
        'windORer',
        'Ma',
        'Jin'
      );
      const userId = (user as { token: string }).token;
      expect(
        adminUserPasswordUpdate(userId, 'windORer', 'aaaiwantdrop')
      ).toStrictEqual({});
    });
  
    test.each([
      { invalidPassword: 'admsawirm' },
      { invalidPassword: 'woeqekqp132' },
    ])(
      'New Password does not contain at least one number and at least one letter error',
      ({ invalidPassword }) => {
        const result = adminAuthRegister(
          'z5437798@gmail.com',
          'windORer',
          'Ma',
          'Jin'
        );
        const user = (result as { token: string }).token;
        expect(
          adminUserPasswordUpdate(user, 'windORer', invalidPassword)
        ).toStrictEqual({ error: expect.any(String) });
      }
    );
  });
  
  describe('adminUserPasswordUpdate Successfully', () => {
    beforeEach(() => {
      clear();
    });
    test('adminUserPasswordUpdate Successfully', () => {
      const result = adminAuthRegister(
        'z5437798@gmail.com',
        'windORer',
        'Ma',
        'Jin'
      );
      const user1Id = (result as { token: string }).token;
      adminUserPasswordUpdate(user1Id, 'windORer', 'NewwindORer');
      adminUserPasswordUpdate(user1Id, 'NewwindORer', 'Simimase123');
      expect(adminAuthLogin('z5437798@gmail.com', 'Simimase123')).toStrictEqual(
        { token: expect.any(String) }
      );
    });
  });
  