import { adminUserPasswordUpdate } from './auth.js';
import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'

describe('Test Successful case for function adminUserPasswordUpdate.', () => {

    test('Successful case upadate the newPassword of a logged in user.', () => {
        // Reset the dataStore.
        clear();

        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test123123', 'test999999');

        expect(result).toEqual({});
    });

});

describe('Test invalid inputs for function adminUserPasswordUpdate.', () => {

    test('AuthUserId is not a valid user.', () => {
        // Reset the dataStore.
        clear();

        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId + 1, 'test123123', 'test999999');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('Old Password is not the correct old password', () => {
        // Reset the dataStore.
        clear();

        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test1231233', 'test999999');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('Old Password and New Password match exactly.', () => {
        // Reset the dataStore.
        clear();

        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test123123', 'test123123');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('New Password has already been used before by this user.', () => {
        // Reset the dataStore.
        clear();

        const user1 = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const user2 = adminAuthRegister('ahihdnt@gmail.com', 'test593u9', 'Jack', 'Lee');

        const result = adminUserPasswordUpdate(user2.authUserId, 'test593u9', 'test123123');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('New Password is less than 8 characters.', () => {
        // Reset the dataStore.
        clear();

        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test123123', 'wor33d');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('New Password does not contain at least one number and at least one letter', () => {
        // Reset the dataStore.
        clear();

        // do not have any letter
        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test123123', '104870112170');

        expect(result).toEqual({ error: expect.any(String) });
    });

    test('New Password does not contain at least one number and at least one letter', () => {
        // Reset the dataStore.
        clear();

        // do not have any number
        const user = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        const result = adminUserPasswordUpdate(user.authUserId, 'test123123', 'wojiojhsihsndisKkk');

        expect(result).toEqual({ error: expect.any(String) });
    });

});

