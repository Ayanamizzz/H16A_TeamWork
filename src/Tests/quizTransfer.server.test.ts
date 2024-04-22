import { clear } from './other';
import { reqQuizTransfer, reqNewQuiz, registerReq } from './api';

/*
Tests for /v1/admin/quiz/{quizid}/transfer
Error Cases:
  - Quiz Id does not refer to a valid quiz
  - Quiz Id does not refer to a quiz that this user owns
  - userEmail is not a real user
  - userEmail is the current loggined in user (transfering ownership to self)
  - Quiz Id refers to a quiz that has a name that is already used by the target user
  - All sessions for this quiz must be in END state (this will need to be tested in I3)
  - Token is not a valid structure
  - Provided token is a valid structure, but is not for a currently logged in session

Success Cases:
  - Returns Correct object
  - Transfers quiz to user with no quizzes
  - Transfers quiz to user with mulitple quizzes

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

clear();
const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
registerReq('hello1@gmail.com', 'Abc123456', 'FirstName', 'LastName');

describe('POST/v1/admin/quiz/{quizid}/transfer', () => {
  describe('Error Cases', () => {
    test('Quiz Id does not refer to a valid quiz', () => {
      const response = reqQuizTransfer(123, 'yollo@gmail.com', user1Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz Id does not refer to a quiz this user owns', () => {
      const response = reqQuizTransfer(user1Quiz1.quizId, 'yollo@gmail.com', user2Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a quiz this user owns' });
    });

    test('userEmail is not a real user', () => {
      const response = reqQuizTransfer(user1Quiz1.quizId, '124567890@gmail.com', user1Token.token);
      expect(response).toStrictEqual({ error: 'userEmail is not a real user' });
    });

    test('userEmail is the current logged in user', () => {
      const response = reqQuizTransfer(user1Quiz1.quizId, 'user@gmail.com', user1Token.token);
      expect(response).toStrictEqual({ error: 'userEmail is the current logged in user' });
    });

    test('Quiz Id refers to a quiz that has a name that is already used by the target user', () => {
      reqNewQuiz('quiz1', 'description', user2Token.token);
      const response = reqQuizTransfer(user1Quiz1.quizId, 'hello@gmail.com', user1Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id refers to a quiz that has a name that is already used by the target user' });
    });

    test('Token is not a valid structure', () => {
      const response = reqQuizTransfer(123, 'yollo@gmail.com');
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const response = reqQuizTransfer(123, 'yollo@gmail.com', '12345');
      expect(response).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
  });

  describe('Success Cases', () => {
    test('Returns correct object', () => {
      const response = reqQuizTransfer(user1Quiz1.quizId, 'hello1@gmail.com', user1Token.token);
      expect(response).toStrictEqual({});
    });
  });
});

afterAll(() => {
  clear();
});
