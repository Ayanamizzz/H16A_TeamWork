import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizInfo } from './quiz.js';
import { clear } from './others.js';



/*
This is black box testing for adminQuizInfo.js
it get all of the relevant information about current quiz
It return error massage if 
- AuthUserId is ot a valid user
- Quiz ID does not refer to a valid quiz
- Quiz ID does not refer to a quiz that this user owns
*/

describe ( 'Test Success Case for adminQuizInfo', () => {
    test ('All relevant information is correctly input', () => {
        //reset the data before testing
        clear ();
        //register a user and create a quiz
        const authUserId = adminAuthRegister ('jackierandom231@gmail.com', 'jackierandom2313','Jackie','Random');
        const quizId = adminQuizCreate (authUserId, 'Quiz 1', 'This is a quiz');
        const quizInfo = adminQuizInfo (authUserId, quizId);
        expect(quizInfo).toStrictEqual({
            quizId: quizId,
            quizName: 'Quiz 1',
            timeCreated: expect.any(Date),
            timeLastEdited: expect.any(Date),
            description: 'This is a quiz',
        });    
    });
});




descrive ( 'Error Case for adminQuizInfo', () => {
    //Error : AuthUserId is not a valid user.
    test ('AuthUserId is not a valid user, It should return an error message for invaild AuthUser Id', () => {
        clear ();
        const authUserId = adminAuthRegister('email@example.com', 'password4455', 'John', 'Doe');
        const quizId = adminQuizCreate(authUserId, 'Quiz 1', 'This is a quiz');
        const invalidUserId = -1; //assume that the user id is invalid
        expect(() => adminQuizInfo(invalidUserId, quizId)).toStrictEqual({
            error: 'User ID does not refer to a valid user'
        });
    });
    //Error : Quiz ID does not refer to a valid quiz.
    test('Quiz ID does not refer to a valid quiz', () => {
        clear();
        // user creates a quiz
        const user = adminAuthRegister('user@example.com', 'password123', 'Jane', 'Doe');
        // assume that the quiz ID is invalid
        const invalidQuizId = -1;
        expect(() => adminQuizInfo(user, invalidQuizId)).toStrictEqual({
            error: 'Quiz ID does not refer to a valid quiz'
        });
    }); 
    //Quiz ID does not refer to a quiz that this user owns.
    test('Quiz ID does not refer to a quiz that this user owns', () => {
        clear();
        // assume that the first user creates a quiz
        const user1 = adminAuthRegister('user1@example.com', 'password123', 'User', 'One');
        const quizId = adminQuizCreate(user1, 'Quiz 1', 'This is User1\'s quiz');
        // assume that the second user tries to access the first user's quiz
        const user2 = adminAuthRegister('user2@example.com', 'password456', 'User', 'Two');

        expect(() => adminQuizInfo(user2, quizId)).toStrictEqual({
            error: 'Quiz ID does not refer to a quiz this user owns'
        });
    });    
});
