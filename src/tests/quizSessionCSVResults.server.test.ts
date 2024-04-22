import { clear } from './other';
import {
  reqNewQuestion,
  reqNewSession,
  reqNewQuiz,
  registerReq,
  reqGetSessionCSVResults,
  reqSessionStateUpdate
} from './api';

// Clear Objects before
clear();

// Set up test objects
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
const user2 = registerReq('hello1@gmail.com', 'ThePStands1forPassword1', 'Joshboy', 'Hyebuddy');
const quiz = reqNewQuiz('This is the name of the quiz', 'This quiz is so that we can have a lot of fun', user.token);
reqNewQuestion(
  quiz.quizId,
  {
    questionBody: {
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: 'Bob from wellington',
          correct: false
        }
      ],
      thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
    }
  },
  user.token
);
reqNewQuestion(
  quiz.quizId,
  {
    questionBody: {
      question: 'Is this a question?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'you tell me',
          correct: true
        },
        {
          answer: 'yes',
          correct: false
        }
      ],
      thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
    }
  },
  user.token
);
const session = reqNewSession(quiz.quizId, 10, user.token);

/*
Tests for GET/v1/admin/quiz/{quizid}/session/{sessionid}/results/csv
Error Cases:
  - Quiz ID does not refer to a valid quiz
  - Quiz ID does not refer to a quiz that this user owns
  - Session Id does not refer to a valid session within this quiz
  - Session is not in FINAL_RESULTS state
  - Token is not a valid structure
  - Provided token is a valid structure, but is not for a currently logged in session

Success Cases:
  - Due to time contraints will not assess success cases

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/
describe('GET/v1/admin/quiz/{quizid}/session/{sessionid}/results/csv', () => {
  describe('Error cases', () => {
    test('Quiz ID does not refer to a valid quiz', () => {
      const response = reqGetSessionCSVResults(quiz.quizId + 1000, 100, user.token);
      expect(response).toStrictEqual({ error: 'Quiz ID does not refer to a valid quiz' });
    });
    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const response = reqGetSessionCSVResults(quiz.quizId, session.sessionId, user2.token);
      expect(response).toStrictEqual({ error: 'Quiz ID does not refer to a quiz that this user owns' });
    });
    test('Session Id does not refer to a valid session within this quiz', () => {
      const response = reqGetSessionCSVResults(quiz.quizId, session.sessionId + 100, user.token);
      expect(response).toStrictEqual({ error: 'Session Id does not refer to a valid session within this quiz' });
    });
    test('Session is not in FINAL_RESULTS state', () => {
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'END', user.token);
      const response = reqGetSessionCSVResults(quiz.quizId, session.sessionId, user.token);
      expect(response).toStrictEqual({ error: 'Session is not in FINAL_RESULTS state' });
    });
    test('Token is not a valid structure', () => {
      const response = reqGetSessionCSVResults(quiz.quizId, session.sessionId);
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });
    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const response = reqGetSessionCSVResults(quiz.quizId, session.sessionId, '123');
      expect(response).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
  });
});

// Clear all objects
afterAll(() => {
  clear();
});
