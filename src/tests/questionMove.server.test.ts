import { clear } from './other';
import { reqNewQuestion, registerReq, reqNewQuiz, reqMoveQuestion } from './api';

/*
Tests for /v1/admin/quiz/{quizid}/{questionid}/move Move a Quiz Question
Error Cases:
  - Quiz ID does not refer to a valid quiz
  - Quiz ID does not refer to a quiz that this user owns
  - NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions
  - NewPosition is the position of the current question
  - Token is not a valid structure
  - Provided token is valid structure, but is not for a currently logged in session

Success Cases:
  - Correct return object

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

clear();
const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
const quiz1Question1 = reqNewQuestion(
  user1Quiz1.quizId,
  {
    questionBody: {
      thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 4,
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
const quiz1Question3 = reqNewQuestion(
  user1Quiz1.quizId,
  {
    questionBody: {
      thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      question: 'Whats up man',
      duration: 4,
      points: 4,
      answers: [
        {
          answer: 'no much',
          correct: true
        },
        {
          answer: 'im dying',
          correct: false
        },
        {
          answer: 'crying',
          correct: false
        },
        {
          answer: 'the sky',
          correct: false
        }
      ]
    }
  },
  user1Token.token
);

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  describe('Error Cases', () => {
    test('Quiz Id does not refer to a valid quiz', () => {
      const result = reqMoveQuestion(
        123,
        123,
        1,
        user1Token.token
      );
      expect(result).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      const result = reqMoveQuestion(
        user1Quiz1.quizId,
        123,
        1,
        user2Token.token
      );
      expect(result).toStrictEqual({
        error: 'Quiz Id does not refer to a quiz that this user owns'
      });
    });

    test('Question Id does not refer to a valid question within this quiz', () => {
      const result = reqMoveQuestion(
        user1Quiz1.quizId,
        123,
        1,
        user1Token.token
      );
      expect(result).toStrictEqual({
        error: 'Question Id does not refer to a valid question within this quiz'
      });
    });

    test('NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions', () => {
      const result1 = reqMoveQuestion(
        user1Quiz1.quizId,
        quiz1Question1.questionId,
        -1,
        user1Token.token
      );
      expect(result1).toStrictEqual({
        error: 'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions'
      });
    });

    test('NewPosition is the position of the current question', () => {
      const result = reqMoveQuestion(
        user1Quiz1.quizId,
        quiz1Question3.questionId,
        1,
        user1Token.token
      );
      expect(result).toStrictEqual({
        error: 'NewPosition is the position of the current question'
      });
    });

    test('Token is not a valid structure', () => {
      const result = reqMoveQuestion(
        123,
        123,
        2
      );
      expect(result).toStrictEqual({
        error: 'Token is not a valid structure'
      });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const result = reqMoveQuestion(
        123,
        123,
        2,
        '123455'
      );
      expect(result).toStrictEqual({
        error: 'Provided token is a valid structure, but is not for a currently logged in session'
      });
    });
  });

  describe('Success Cases', () => {
    test('Correct return object', () => {
      const result = reqMoveQuestion(
        user1Quiz1.quizId,
        quiz1Question1.questionId,
        1,
        user1Token.token
      );
      expect(result).toStrictEqual({});
    });
  });
});

afterAll(() => {
  clear();
});
