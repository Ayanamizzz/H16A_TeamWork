/* adminQuizRmove.test.js
Error checking:
1. AuthUserId is not a valid user.
2. Quiz ID does not refer to a valid quiz.
3. Quiz ID does not refer to a quiz that this user owns.
*/

import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'
import { adminQuizCreate, adminQuizRmove } from './quiz.js'


describe('Tests for function adminQuizRmove', () => {

    // Test invaild input:

    test('Test invalid input', () => {
        // AuthUserId is not a valid user.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRmove(user.authUserId + 1, quiz.quizId);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });


    test('Test invalid input', () => {
        // Quiz ID does not refer to a valid quiz.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRmove(user.authUserId, quiz.quizId + 1);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('Test invalid input', () => {
        // Quiz ID does not refer to a quiz that this user owns.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user1 = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz1 = adminQuizCreate(user1.authUserId, 'Quiz1', 'The first quiz');

        const user2 = adminAuthRegister('majin666@gmail.com', 'ziwhidnimnw', 'Ma', 'Jin');
        const quiz2 = adminQuizCreate(user2.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizCreate(user1.authUserId, quiz2.quizId);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });


    // Test successful adminQuizCreate:

    test('Test successful adminQuizCreate', () => {
        // Test successful return value with vaild input.

        // Reset before test.
        clear();

        // Create quiz that return quizId if no error
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRmove(user.authUserId, quiz.quizId);
        expect(result).toStrictEqual({ });
    });
});

