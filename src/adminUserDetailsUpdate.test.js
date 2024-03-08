import { adminAuthRegister } from './auth.js';
import { adminUserDetailsUpdate } from './auth.js'
import { clear } from './other.js';


describe("Test successful case for adminUserDetailsUpdate", () => {

    test("Successful case, return empty object.", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'Jack', 'Woe');

        expect(result).toStrictEqual({})
    });

});

describe("Test invalid input fot adminUserDetailsUpdate", () => {

    test("AuthUserId is not a valid user", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId + 1, 'auhdia@gmail.com', 'Jack', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test("Email is currently used by another user.", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user1 = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const user2 = adminAuthRegister('hiahsfid2@gmail.com', 'sinq8901L', 'Ma', 'Jin');

        const result = adminUserDetailsUpdate(user2.authUserId, 'ew129090hj@gmail.com', 'Jack', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test("Email does not satisfy.", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'invalidemail', 'Jack', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test("NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or aposrtrophes.", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'J$', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

    test("NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or aposrtrophes.", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'Jack', 'W@@');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

    test("NameFirst is less than 2 characters", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'J', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

    test("NameFirst is more than 20 characters", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'Jishfiainhindeuahfaihfue', 'Woe');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

    test("NameLast is less than 2 characters", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'Jack', 'W');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

    test("NameLast is more than 20 characters", () => {
        // Reset dataStore.
        clear();

        // Create a user then update the email, nameFirst and nameLast.
        const user = adminAuthRegister('ew129090hj@gmail.com', 'hjdh1783hj', 'Leo', 'Wang');
        const result = adminUserDetailsUpdate(user.authUserId, 'auhdia@gmail.com', 'Jack', 'Woeajbhiebuqjfhniksnid');

        expect(result).toStrictEqual({ error: expect.any(String) })
    });

});