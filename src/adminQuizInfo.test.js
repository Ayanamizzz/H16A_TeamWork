import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizInfo } from './quiz.js';
import { clear } from './other.js';



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
        const userResult = adminAuthRegister ('jackierandom231@gmail.com', 'jackierandom2313','Jackie','Random');
        const quizId = adminQuizCreate (userResult.authUserId, 'Quiz 1', 'This is a quiz');
        const quizInfo = adminQuizInfo (userResult.authUserId, quizId.quizId);
        expect(quizInfo).toStrictEqual({
            quizId: quizId.quizId,
            quizName: 'Quiz 1',
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: 'This is a quiz',
        });    
    });
});




describe ( 'Error Case for adminQuizInfo', () => {
    //Error : AuthUserId is not a valid user.
    test ('AuthUserId is not a valid user, It should return an error message for invaild AuthUser Id', () => {
        clear ();
        const userResult = adminAuthRegister('email@example.com', 'password4455', 'John', 'Doe');
        const quizId = adminQuizCreate(userResult.authUserId, 'Quiz 1', 'This is a quiz');
        const invalidUserId = -1; //assume that the user id is invalid
        const quizInfo = adminQuizInfo(invalidUserId, quizId);
        expect(quizInfo).toStrictEqual({
            error: 'AuthUserId is not a valid user'
        });
    });
    //Error : Quiz ID does not refer to a valid quiz.
    test('Quiz ID does not refer to a valid quiz', () => {
        clear();
        const user = adminAuthRegister('user@example.com', 'password123', 'Jane', 'Doe').authUserId;
        //assume that the quiz id is invalid
        const invalidQuizId = -1; 
        const quizInfo = adminQuizInfo(user, invalidQuizId);
        expect(quizInfo).toStrictEqual({
            error: 'Quiz ID does not refer to a valid quiz'
        });
    }); 
    //Quiz ID does not refer to a quiz that this user owns.
    test('Quiz ID does not refer to a quiz that this user owns', () => {
        clear();
        const user1 = adminAuthRegister('user1@example.com', 'password123', 'User', 'One').authUserId;
        const quizId = adminQuizCreate(user1, 'Quiz 1', 'This is User1\'s quiz').quizId;
        const user2 = adminAuthRegister('user2@example.com', 'password456', 'User', 'Two').authUserId;
    
        const quizInfo = adminQuizInfo(user2, quizId);
        expect(quizInfo).toStrictEqual({
            error: 'Quiz ID does not refer to a quiz this user owns'
        });
    });    
});
