/* adminQuizRmove.test.js
Error checking:
1. AuthUserId is not a valid user.
2. Quiz ID does not refer to a valid quiz.
3. Quiz ID does not refer to a quiz that this user owns.
*/

import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'
import { adminQuizCreate, adminQuizRemove } from './quiz.js'


describe('Test invaild input for function adminQuizRemove', () => {

    test('Test invalid authUserId', () => {
        // AuthUserId is not a valid user.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRemove(user.authUserId + 1, quiz.quizId);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });


    test('Test invalid quizId', () => {
        // Quiz ID does not refer to a valid quiz.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRemove(user.authUserId, quiz.quizId + 1);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

    test('Test invalid quizId', () => {
        // Quiz ID does not refer to a quiz that this user owns.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user1 = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz1 = adminQuizCreate(user1.authUserId, 'Quiz1', 'The first quiz');

        const user2 = adminAuthRegister('majin666@gmail.com', 'Linked12256', 'Ma', 'Jin');
        const quiz2 = adminQuizCreate(user2.authUserId, 'Quiz2', 'The second quiz');

        const result = adminQuizRemove(user1.authUserId, quiz2.quizId);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

});


describe('Test successful case for function adminQuizRmove', () => {

    test('Test successful adminQuizRmove', () => {
        // Test successful return value with vaild input.

        // Reset before test.
        clear();

        // Create quiz that return null if no error
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizRemove(user.authUserId, quiz.quizId);
        expect(result).toStrictEqual({ });
    });

});

