import { clear } from './other';
import { registerReq, reqDeleteQuestion, reqNewQuiz, reqNewQuestion } from './api';

beforeEach(() => {
  clear();
});

/*
Tests for /v1/admin/quiz/{quizid}/{questionid} Delete Quiz Question
Error Cases:
  - Quiz ID does not refer to a valid quiz
  - Quiz ID does not refer to a quiz that this user owns
  - Question Id does not refer to a valid question within this quiz
  - All sessions for this quiz must be in END state

Success Cases:
  - Correct return object

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('DELETE/v1/admin/quiz/{quizid}/question/{questionid}', () => {
  describe('Error cases', () => {
    test('Quiz ID does not refer to a valid quiz', () => {
      const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const response = reqDeleteQuestion(123, 123, user1Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
      const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
      const response = reqDeleteQuestion(user1Quiz1.quizId, 123, user2Token.token);
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a quiz that this user owns' });
    });

    test('Question Id does not refer to a valid question within this quiz', () => {
      const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
      const response = reqDeleteQuestion(user1Quiz1.quizId, 12345, user1Token.token);
      expect(response).toStrictEqual({ error: 'Question Id does not refer to a valid question within this quiz' });
    });

    test('Token is not a valid structure', () => {
      const response = reqDeleteQuestion(123, 123);
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      const response = reqDeleteQuestion(123, 123, '12345');
      expect(response).toStrictEqual({ error: 'Provided token is valid structure, but is not for a currently logged in session' });
    });
  });

  describe('Success cases', () => {
    test('correct return object', () => {
      const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
      const quiz1Question1 = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      const response = reqDeleteQuestion(user1Quiz1.quizId, quiz1Question1.questionId, user1Token.token);
      expect(response).toStrictEqual({});
    });
  });
});

afterAll(() => {
  clear();
});
