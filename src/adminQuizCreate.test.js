/* adminQuizCreate.test.js
Error checking:
1. AuthUserId is not a valid user.
2. Name contains invalid characters. Valid characters are alphanumeric and spaces.
3. Name is either less than 3 characters long or more than 30 characters long.
4. Name is already used by the current logged in user for another quiz.
5. Description is more than 100 characters in length (note: empty strings are OK).
*/

import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'
import { adminQuizCreate } from './quiz.js'


describe('Tests for function adminQuizCreate', () => {
    
    // Test invaild input:

    test('Test invalid input', () => {
        // AuthUserId is not a valid user.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(user.authUserId + 1, 'Quiz1', 'The first quiz');
        
        expect(result).toStrictEqual({ error: expect.any(String) });
    });


    test('Test invalid input', () => {
        // Name contains invalid characters（Valid characters are alphanumeric and spaces.）

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(user.authUserId, 'Qu!z@@', 'The first quiz');
        expect(result).toStrictEqual({ error: expect.any(String) });
    });


    test('Test invalid input', () => {
        // Name is either less than 3 characters long or more than 30 characters long.
        // This test will check name is less than 3 characters long.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(user.authUserId, 'Q', 'The first quiz');
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('Test invalid input', () => {
        // Name is either less than 3 characters long or more than 30 characters long.
        // This test will check name is more than 30 characters long.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(user.authUserId, 'Quiz for COMP1531 Group project Team Dream', 'The first quiz');
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('Test invalid input', () => {
        // Name is already used by the current logged in user for another quiz.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result1 = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result2 = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');
        expect(result2).toStrictEqual({ error: expect.any(String) });
    });

    test('Test invalid input', () => {
        // Description is more than 100 characters in length (note: empty strings are OK).

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const authUserId = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(authUserId, 'Quiz1', 'The first quiz that used for group project iteration 1 of course COMP1531 Software Engineering Fundamentals');
        expect(result).toStrictEqual({ error: expect.any(String) });
    });



    // Test successful adminQuizCreate:

    test('Test successful adminQuizCreate', () => {
        // Test successful return value with vaild input.

        // Reset before test.
        clear();

        // Create quiz that return quizId if no error
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const result = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');
        expect(result).toStrictEqual({ quizId: expect.any(Number) });
    });
});

