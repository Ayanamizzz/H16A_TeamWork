import { adminUserDetails, adminAuthRegister } from './auth.js';
import { clear } from './other.js';
// Test for adminUserDetail


describe('Test for adminUserDetails --- Successful', () => {
    
    // Test for valid input
    test('Test successful adminUserDetails', () => {
        clear();
        // authUserId is a valid user
        const authUserId = adminAuthRegister('linked@gmail.com', 'linked12345', 'Jim', 'Yang');
        let finalreturn = adminUserDetails(authUserId);
        expect(finalreturn).toStrictEqual(
            {
                user:
                {
                    userId: authUserId,
                    name: 'Jim Yang',
                    email: 'linked@gmail.com',
                    numSuccessfulLogins: 1,
                    numFailedPasswordsSinceLastLogin: 0,
                }
            });
    });

    test('Test successful adminUserDetails', () => {
        clear();
        // authUserId is a valid user
        const authUserId = adminAuthRegister('test123@outlook.com', 'testpassword123', 'Kim', 'Liu');
        let finalreturn = adminUserDetails(authUserId);
        expect(finalreturn).toStrictEqual(
            {
                user:
                {
                    userId: authUserId,
                    name: 'Kim Liu',
                    email: 'test123@outlook.com',
                    numSuccessfulLogins: 1,
                    numFailedPasswordsSinceLastLogin: 0,
                }
            });

    });
});

describe('Test for adminUserDetails --- error', () => {
    beforeEach(() => {
        clear();
    });
    test.each([
        [12312],
        [3892839],
        [535454],
        [3345346],
    ])('Test AuthUserId is not a valid user (%i)', (authUserId) => {
        expect(adminUserDetails(authUserId)).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });
});

