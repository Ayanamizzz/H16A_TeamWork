/* adminQuizList.test.js
Error checking:
1. AuthUserId is not a valid user.
*/

import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'
import { adminQuizCreate, adminQuizList} from './quiz.js'


describe('Test invalid input for function adminQuizList', () => {

    test('Test invalid authUserId', () => {
        // AuthUserId is not a valid user.

        // Reset before test.
        clear();

        // Create quiz then check error message.
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');

        const result = adminQuizList(user.authUserId + 1);
        expect(result).toStrictEqual({ error: expect.any(String) });
    });

});


describe('Test successful case for function adminQuizList', () => {

    test('Test successful adminQuizList', () => {
        // Test successful return value with vaild input.

        // Reset before test.
        clear();

        // Create quizzes that return list of quizzes if no error
        const user = adminAuthRegister('linked@gmail.com', 'linked123456', 'Jack', 'Wang');
        const quiz1 = adminQuizCreate(user.authUserId, 'Quiz1', 'The first quiz');
        const quiz2 = adminQuizCreate(user.authUserId, 'Quiz2', 'The second quiz');

        const result = adminQuizList(user.authUserId);
        expect(result).toStrictEqual({ 
            quizzes: [
                {
                    quizId: quiz1.quizId,
                    name: 'Quiz1'
                },
                {
                    quizId: quiz2.quizId,
                    name: 'Quiz2'
                }
            ]
        });
    });
    
});

