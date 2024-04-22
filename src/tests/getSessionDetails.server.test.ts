import { State } from './../dataStore';
import { clear } from './other';
import {
  registerReq,
  reqNewQuiz,
  reqNewQuestion,
  reqGetSessionStatus,
  reqNewSession
} from './api';

// Clear Objects before
clear();

// Set up test objects
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
const user2 = registerReq('tester@gmail.com', 'ThePStandsforPassword1', 'Thisguy', 'Jimmy');
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
const quiz2 = reqNewQuiz('This is the name of the quiz2', 'This quiz is so that we can have a lot of fun', user2.token);

/*
Tests for /v1/admin/quiz/{quizid}/session/{sessionid} Get session details
Error Cases:
  - Token is not a valid structure
  - Provided token is valid structure, but is not for a currently logged in session
  - Quiz ID does not refer to a valid quiz
  - Quiz ID does not refer to a quiz that this user owns
  - Session Id does not to a valid question in this quiz

Success Cases:
  - Correct return object

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

// Note we are not checking for Error throwing in error cases as we are using multipl helper functions
// to get to the HTTP call. Checking for object will suffice
describe('GET/v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  describe('error cases', () => {
    test('Token is not a valid structure', () => {
      expect(reqGetSessionStatus(1, '1')).toStrictEqual({ error: expect.any(String) });
    });

    test('Provided token is valid structure, but is not for a currently logged in session', () => {
      expect(reqGetSessionStatus(1, '123', '123')).toStrictEqual({ error: expect.any(String) });
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      expect(reqGetSessionStatus(100, '123', user.token)).toStrictEqual({ error: expect.any(String) });
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      expect(reqGetSessionStatus(quiz2.quizId, '123', user.token)).toStrictEqual({ error: expect.any(String) });
    });

    test('Session Id does not to a valid question in this quiz', () => {
      expect(reqGetSessionStatus(quiz.quizId, '123', user.token)).toStrictEqual({ error: expect.any(String) });
    });
  });

  describe('success cases', () => {
    const session = reqNewSession(quiz.quizId, 10, user.token);
    const res = reqGetSessionStatus(quiz.quizId, session.sessionId, user.token);
    expect(res).toStrictEqual({
      sessionId: expect.any(Number),
      state: State.LOBBY,
      atQuestion: expect.any(Number),
      players: [],
      autoStartNum: expect.any(Number),
      messages: [],
      metadata: {
        quizId: expect.any(Number),
        quizName: 'This is the name of the quiz',
        authorUserId: expect.any(Number),
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'This quiz is so that we can have a lot of fun',
        questionBank: [
          {
            questionId: expect.any(Number),
            question: 'Who is the Monarch of England?',
            thumbnailUrl: expect.any(String),
            duration: expect.any(Number),
            points: 5,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'Prince Charles',
                colour: expect.anything(),
                correct: true
              },
              {
                answerId: expect.any(Number),
                answer: 'Bob from wellington',
                correct: false,
                colour: expect.anything(),
              }
            ]
          }
        ],
        thumbnailUrl: expect.any(String)
      }
    });
  });
});

// Clear all objects
afterAll(() => {
  clear();
});
