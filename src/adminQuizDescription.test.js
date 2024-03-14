import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizDescriptionUpdate } from './quiz.js';
import { clear } from './other.js';

/*
This is black box testing for adminQuizDescriptionUpdate function.
This function willUpdate the description of the relevant quiz.
It return an error massage if
-AuthUserId is not a valid user
-Quiz ID does not refer to a valid quiz
-Quiz ID does not refer to a quiz that this user owns
-Description is more than 100 characters in length (note: empty strings are OK)
*/

describe('Success Cases that update the quiz description with vaild inputs', () => {
    test('should update the quiz description when all inputs are valid', () => {
        clear(); 
        // create a user and a quiz
        const user = adminAuthRegister('validemail@example.com', 'password23232', 'Jackie', 'Random');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz Name', 'Original Description');
        // create a valid description which is less than 100 characters long
        const validDescription = 'This is the new description of the quiz, which is less than 100 characters long.';
        // update the quiz description
        const updateResult = adminQuizDescriptionUpdate(user.authUserId, quiz.quizId, validDescription);  
        // check that the description has been updated
        expect(updateResult).toStrictEqual({});
    });
});

describe('Failure Cases that do not update the quiz description with invalid inputs', () => {
    test('should not update the quiz description when the user is not valid', () => {
        clear(); 
        // assume that the user is not valid
        const invalidUserId = -1
        // assume a vaild quiz id and a valid description
        const validQuizId = 1;
        const validDescription = 'This is the new description of the quiz, which is less than 100 characters long.';
        //try to update the quiz description with invalid userid but vaild description and quiz id
        const updateResult = adminQuizDescriptionUpdate(invalidUserId, validQuizId, validDescription);
        expect (updateResult).toStrictEqual({ error: 'AuthUserId is not a valid user.'});
    });
    test('should return an error if the quizId does not refer to a valid quiz', () => {
        clear(); 
        // Register a user and assume the authUserId returned is valid
        const user = adminAuthRegister('validemail@example.com', 'password4515', 'Jackie', 'Random');
        const invalidQuizId = -1; // An assumed invalid quizId
        const validDescription = 'This is a valid description.';
        // Attempt to update the description with an invalid quizId
        const updateResult = adminQuizDescriptionUpdate(user.authUserId, invalidQuizId, validDescription);
        // Validate that the function returns an object containing the specific error message
        expect(updateResult).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz.' });
    });
    test('should return an error if the quizId does not refer to a quiz that this user owns', () => {
        clear(); 
        // Register two users
        const userOne = adminAuthRegister('userone@example.com', 'password123123', 'korn', 'Coe');
        const userTwo = adminAuthRegister('usertwo@example.com', 'password434343', 'Jane', 'Top');
        // User One creates a quiz, assuming the returned quizId is valid
        const quiz = adminQuizCreate(userOne.authUserId, 'User One Quiz', 'Description for User One Quiz');
        // User Two attempts to update the description of User One's quiz
        const validDescription = 'This is a valid description.';
        const updateResult = adminQuizDescriptionUpdate(userTwo.authUserId, quiz.quizId, validDescription);
        // Validate that the function returns an object containing the specific error message
        expect(updateResult).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns.' });
    });    
    test('should return an error if the description is more than 100 characters long', () => {
        clear(); 
        // Register a user and create a quiz, assuming the authUserId and quizId returned are valid
        const user = adminAuthRegister('validemail@example.com', 'password1231231', 'John', 'Doe');
        const quiz = adminQuizCreate(user.authUserId, 'Quiz Name', 'Initial Description');
        // Construct a description that is too long (>100 characters)
        const longDescription = 'This description is deliberately made longer than one hundred characters to test the validation logic of the update function ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.';
        // Attempt to update the quiz description with a too long description
        const updateResult = adminQuizDescriptionUpdate(user.authUserId, quiz.quizId, longDescription);
        // Validate that the function returns an object containing the specific error message
        expect(updateResult).toStrictEqual({ error: 'Description is more than 100 characters in length (note: empty strings are OK).' });
    });
});
