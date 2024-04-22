import { clear } from './other';
import { reqRestoreQuiz, registerReq, reqNewQuiz, reqQuizDelete } from './api';

clear();
const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');

describe('POST/v1/admin/quiz/{quizid}/restore', () => {
  describe('Error cases', () => {
    test('Non valid quiz', () => {
      const response = reqRestoreQuiz(123, user1Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz is not correctly in trash', () => {
      const response = reqRestoreQuiz(user1Quiz1.quizId, user1Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id refers to a quiz that is not currently in the trash' });
    });

    test('Token is not a valid structure', () => {
      const response = reqRestoreQuiz(12345);
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      const response = reqRestoreQuiz(12345, '12345');
      expect(response).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });

    test('User doesnt own quiz', () => {
      reqQuizDelete(user1Quiz1.quizId, user1Token.token);
      const response = reqRestoreQuiz(user1Quiz1.quizId, user2Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a quiz that this user owns' });
    });
  });

  describe('Success cases', () => {
    test('Correct Return object, status and correct return from adminQuizList', () => {
      reqQuizDelete(user1Quiz1.quizId, user1Token.token);
      const response = reqRestoreQuiz(user1Quiz1.quizId, user1Token.token);
      expect(response).toStrictEqual({});
    });
  });
});

afterAll(() => {
  clear();
});
