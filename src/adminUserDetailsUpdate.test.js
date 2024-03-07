import { adminAuthRegister } from './auth.js';
import { adminUserDetailsUpdate } from './auth.js'
import { clear } from './others.js';

// Test for successful adminUserDetailsUpdate
test('Test successful adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('123test@gmail.com', 'test123123', 'Nancy', 'Wang');
    let result = adminUserDetailsUpdate(authUserId, '123123test@gmail.com', 'Sally', 'Zhang');
    expect(result).toEqual({});
});

test('Test successful adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate(authUserId, '123123test@gmail.com', 'Bob', 'Wang');
    expect(result).toEqual({});
});

// Error: AuthUserId is not a valid user.
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob', 'Wang');
    expect(result).toEqual({error: 'AuthUserId is not a valid user.'});
});

// Error: Email is currently used by another user.
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob', 'Wang');
    expect(result).toEqual({error: 'Email is currently used by another user.'});
});

// Error: Email does not satisfy this: https://www.npmjs.com/package/validator (validator.isEmail)
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@.com', 'Bob', 'Wang');
    expect(result).toEqual({error: 'Email is not valid.'});
});

// Error: NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob1', 'Wang');
    expect(result).toEqual({error: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'});
});

// Error: NameFirst is less than 2 characters or more than 20 characters.
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'B', 'Wang');
    expect(result).toEqual({error: 'NameFirst is less than 2 characters or more than 20 characters.'});
});

test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'nameisnacywangfromchina', 'Wang');
    expect(result).toEqual({error: 'NameFirst is less than 2 characters or more than 20 characters.'});
});

// Error: NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob', 'Wang123');
    expect(result).toEqual({error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'});
});

// Error: NameLast is less than 2 characters or more than 20 characters
test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob', 'W');
    expect(result).toEqual({error: 'NameLast is less than 2 characters or more than 20 characters.'});
});

test('Test error adminUserDetailsUpdate', () => {
    clear();

    let authUserId = adminAuthRegister('999test@gmail.com', 'test123999', 'Nancy', 'Yang');
    let result = adminUserDetailsUpdate('bbb', '123123test@gmail.com', 'Bob', 'imqixuanWangfromchinayyyyy');
    expect(result).toEqual({error: 'NameLast is less than 2 characters or more than 20 characters.'});
});
