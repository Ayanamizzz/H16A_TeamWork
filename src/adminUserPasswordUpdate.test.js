import { adminUserPasswordUpdate } from './auth.js';
import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'

describe('Tests for function adminUserPasswordUpdate  ---  Successful', () => {
    // Test for successful adminUserPasswordUpdate
    test('Test successful adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
        let result = adminUserPasswordUpdate(authUserId, 'test123123', 'test999999');
        expect(result).toEqual({});
    });

    test('Test successful adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
        let result = adminUserPasswordUpdate(authUserId, 'test123999', 'test456456');
        expect(result).toEqual({});
    });
});

describe('Tests for function adminUserPasswordUpdate  ---  error', () => {
    // Error: AuthUserId is not a valid user.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
        let result = adminUserPasswordUpdate('bbb', 'test123999', 'cse123123');
        expect(result).toEqual({ error: 'AuthUserId is not a valid user.' });
    });

    // Error: Old Password is not the correct old password.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
        let result = adminUserPasswordUpdate(authUserId, 'wrong123123', 'cse123123');
        expect(result).toEqual({ error: 'Old Password is not the correct old password.' });
    });

    // Error: Old Password and New Password match exactly.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test111999', 'Nancy', 'Wang');
        let result = adminUserPasswordUpdate(authUserId, 'test111999', 'test111999');
        expect(result).toEqual({ error: 'Old Password and New Password match exactly.' });
    });

    // Error: New Password has already been used before by this user.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test111999', 'Nancy', 'Wang');
        let result = adminUserPasswordUpdate(authUserId, 'test111999', 'test123123');
        expect(result).toEqual({ error: 'New Password has already been used before by this user.' });
    });

    // Error: New Password is less than 8 characters.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test111999', 'Nancy', 'Wang');
        let result = adminUserPasswordUpdate(authUserId, 'test111999', 'test12');
        expect(result).toEqual({ error: 'New Password is less than 8 characters.' });
    });

    // Error: New Password does not contain at least one number and at least one letter.
    test('Test error adminUserPasswordUpdate', () => {
        clear();

        let authUserId = adminAuthRegister('999test@gmail.com', 'test111999', 'Nancy', 'Wang');
        let result = adminUserPasswordUpdate(authUserId, 'test111999', '346726372');
        expect(result).toEqual({ error: 'New Password does not contain at least one number and at least one letter.' });
    });
});

