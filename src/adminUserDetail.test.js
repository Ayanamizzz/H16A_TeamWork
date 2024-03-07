import { adminUserDetails } from './auth.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';
// Test for adminUserDetail

beforeEach(() => {
    clear();
});

describe('Test for adminUserDetails --- Successful', () => {
    // Test for valid input
    test('Test successful adminUserDetails', () => {
        // authUserId is a valid user
        const authUserId = adminAuthRegister('linked@gmail.com', 'linked12345', 'Jim', 'Yang');
        let finalreturn = adminUserDetails(authUserId);
        expect(finalreturn).tobe(
            {
                user:
                {
                    userId: authUserId,
                    name: 'Jim Yang',
                    email: 'linked@gmail.com',
                    numSuccessfulLogins: numSuccessfulLogins,
                    numFailedPasswordsSinceLastLogin: numFailedPasswordsSinceLastLogin,
                }
            });
    });

    test('Test successful adminUserDetails', () => {
        // authUserId is a valid user
        const authUserId = adminAuthRegister('test123@outlook.com', 'testpassword123', 'Kim', 'Liu');
        let finalreturn = adminUserDetails(authUserId);
        expect(finalreturn).tobe(
            {
                user:
                {
                    userId: authUserId,
                    name: 'Kim Liu',
                    email: 'test123@outlook.com',
                    numSuccessfulLogins: numSuccessfulLogins,
                    numFailedPasswordsSinceLastLogin: numFailedPasswordsSinceLastLogin,
                }
            });

    });
});

describe('Test for adminUserDetails --- error', () => {
    test.each([
        [12312],
        [3892839],
        [535454],
        [3345346],
    ])('Test AuthUserId is not a valid user (%i)', (authUserId) => {
        expect(adminUserDetails(authUserId)).toStrictEqual({ error: 'AuthUserId is not a valid user' });
    });
});


