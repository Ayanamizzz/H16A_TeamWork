import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizNameUpdate } from './quiz.js';
import { clear } from './others.js';


/*
This is black box testing for adminQUIZNameUpdate function.
this function aim to update the name of the relevant quiz.
It return erroe massage if
- authUserId is not a valid user
- quizId does not refer to a valid quiz
- quizId does not refer to a quiz that this user owns
- name contains any characters that are not alphanumeric or are spaces
- name is less than 3 characters long
- name is longer than 30 characters long
- name is already used by the current logged in user for another quiz
*/

describe ('Success Cases that update the quiz name with vaild inputs', () => {
    Test('name is exactly 3 characters long', () => {
        clear();
        const user = adminAuthRegister('validemail@example.com', 'validPassword123', 'Jok', 'Doe');
        const quiz = adminQuizCreate(user.authUserId, 'Original Quiz Name', 'A description');
        // update the quiz name
        const updateResult = adminQuizNameUpdate(user.authUserId, quiz.quizId, 'LOL');
        expect(updateResult).toStrictEqual({});
    });
    Test('name more than 3 but less than 30 characters long', () => {
        clear();
        const user = adminAuthRegister('validemail@example.com', 'validPassword123', 'Jiok', 'Dsoe');
        const quiz = adminQuizCreate(user.authUserId, 'Original Quiz Name', 'A description');
        // update the quiz name
        const updateResult = adminQuizNameUpdate(user.authUserId, quiz.quizId, 'LOLILovePizza');
        expect(updateResult).toStrictEqual({});
    });
});    

describe ('Error case for function adminQuizNameUpdate', () => {
    Test('authUserId is not a valid user', () => {
        clear();
        //assume -1 is impossible to be a valid user's id
        const invalidAuthUserId = -1;
        //assume 1 is a valid quiz id
        const validQuizId = 1; 
        const updateResult = adminQuizNameUpdate(invalidAuthUserId, validQuizId, 'New Quiz Name');    
        expect(updateResult).toStrictEqual({ error: 'AuthUserId is not a valid user.' });
    });  
    test ('Quiz ID does not refer to a vaild quiz', () => {
        clear();
        const validAuthUserId = adminAuthRegister('email@example.com', 'password233', 'John', 'Doe').authUserId;
        //assume -1 is impossible to be a valid quiz's id
        const invalidQuizId = -1;
        const updateResult = adminQuizNameUpdate(validAuthUserId, invalidQuizId, 'New Quiz Name');
        expect(updateResult).toStrictEqual({ error: 'QuizId does not refer to a valid quiz.' });
    });  
    test ('Quiz ID does not refer to a quiz that this user owns', () => {
        clear();
        //register a user 
        const user1 = adminAuthRegister('email@example.com', 'password31231', 'John', 'Doe');
        //register another user
        const user2 = adminAuthRegister('usertwo@example.com', 'password32323', 'Jane', 'Smith');
        //user1 create a quiz
        const UserOneQuiz = adminQuizCreate(user1.authUserId, 'User1 quiz name', 'Description');
        //the second user trying to create another quiz with user 1's quiz id
        const updateResult = adminQuizNameUpdate(user2.authUserId, userOneQuiz.quizId, 'New Name Attempt by User Two');
        expect(updateResult).toStrictEqual({ error: 'QuizId does not refer to a quiz that this user owns.' });
    }); 
    test ('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
        clear();
        //register a user
        const user = adminAuthRegister('email@example.com', 'password23232', 'Yuchao', 'Wang');
        const quiz = adminQuizCreate(user.authUserId, 'Original Quiz Name', 'A description');
        const invalidName = 'InvalidName@#$%^&*';
        const updateResult = adminQuizNameUpdate(user.authUserId, quiz.quizId, invalidName);
        expect(updateResult).toStrictEqual({ error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces.' });
    });
    test('should return an error if the name is less than 3 characters long', () => {
        clear(); 
        // register a user and create a quiz
        const user = adminAuthRegister('validemail@example.com', 'password123', 'John', 'Doe');
        const quiz = adminQuizCreate(user.authUserId, 'Valid Name', 'Valid Description');
        // update the quiz name with a name that is less than 3 characters long
        const shortName = 'No';
        const updateResult = adminQuizNameUpdate(user.authUserId, quiz.quizId, shortName);
        expect(updateResult).toStrictEqual({ error: 'Name is less than 3 characters long.' });
    });
    test('should return an error if the name is longer than 30 characters', () => {
        clear(); 
        // register a user and create a quiz
        const user = adminAuthRegister('validemail@example.com', 'password123', 'John', 'Doe');
        const quiz = adminQuizCreate(user.authUserId, 'Valid Quiz Name', 'A valid description');
        // update the quiz name with a name that is longer than 30 characters long
        const longName = 'This Quiz Name Is Definitely Way Too Long ahhhhhhhhhhhhh';
        const updateResult = adminQuizNameUpdate(user.authUserId, quiz.quizId, longName);
        expect(updateResult).toStrictEqual({ error: 'Name is longer than 30 characters long.' });
    });
    test('should return an error if the name is already used by the current logged in user for another quiz', () => {
        clear(); 
        const user = adminAuthRegister('user@example.com', 'password123', 'Jane', 'Doe');
        // user creates the first quiz with unique name
        const originalQuiz = adminQuizCreate(user.authUserId, 'Unique Name', 'Description for the first quiz');
        // the same user creates the second quiz with another unique name
        const newQuiz = adminQuizCreate(user.authUserId, 'Another Unique Name', 'Description for the second quiz');
        // try to update the name of the second quiz to be the same as the first quiz
        const updateResult = adminQuizNameUpdate(user.authUserId, newQuiz.quizId, 'Unique Name');
        expect(updateResult).toStrictEqual({ error: 'Name is already used by the current logged in user for another quiz.' });
    });
});  