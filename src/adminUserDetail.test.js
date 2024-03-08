import { adminUserDetails, adminAuthRegister, adminAuthLogin } from './auth.js';
import { clear } from './other.js';
// Test for adminUserDetail


describe('Test for function adminUserDetails --- Successful', () => {
    
    test('Test successful adminUserDetails', () => {
        // reset the dataStore.
        clear();

        // check Login success.
        const user = adminAuthRegister('sby1010284295@gmail.com', 'wind4ever233qwq', 'Jim', 'Yang');
        const check_user = adminAuthLogin('sby1010284295@gmail.com', 'wind4ever233qwq');
        const result = adminUserDetails(user.authUserId);

        expect(result).toStrictEqual(
            {
                user:
                {
                    userId: user.authUserId,
                    name: 'Jim Yang',
                    email: 'sby1010284295@gmail.com',
                    numSuccessfulLogins: 2,
                    numFailedPasswordsSinceLastLogin: 0,
                }
        });
    });
    

    test('Test successful adminUserDetails', () => {
        // reset the dataStore.
        clear();

        // check Login failed.
        const user = adminAuthRegister('sby1010284295@gmail.com', 'wind4ever233qwq', 'Jim', 'Yang');
        const check_user = adminAuthLogin('sby1010284295@gmail.com', 'wind4ever233');
        const result = adminUserDetails(user.authUserId);
        
        expect(result).toStrictEqual(
            {
                user:
                {
                    userId: user.authUserId,
                    name: 'Jim Yang',
                    email: 'sby1010284295@gmail.com',
                    numSuccessfulLogins: 1,
                    numFailedPasswordsSinceLastLogin: 1,
                }
            });

    });
});

describe('Test for invalid input', () => {

    test('Test authUserId', () => {
        // reset the dataStore.
        clear();

        const user = adminAuthRegister('iwhi92hni@gmail.com', 'LIjna12909', 'Jack', "Wag");
        const result = adminUserDetails (user.authUserId + 1);

        expect(result).toStrictEqual({ error: expect.any(String) });
    });

});

