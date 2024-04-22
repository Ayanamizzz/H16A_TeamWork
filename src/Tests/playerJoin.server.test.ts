import { clear } from './other';
import {
  registerReq,
  reqNewQuiz,
  reqNewQuestion,
  reqNewSession,
  reqPlayerJoin,
  reqSessionStateUpdate
} from './api';

// Clear Objects before
clear();

// Set up test objects
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
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
const session = reqNewSession(quiz.quizId, 10, user.token);

// Note we are not checking for Error throwing in error cases as we are using multipl helper functions
// to get to the HTTP call. Checking for object will suffice
describe('POST/v1/player/join', () => {
  describe('success cases', () => {
    test('Player joins session', () => {
      const result = reqPlayerJoin(session.sessionId, 'Yang');
      expect(result).toStrictEqual({ playerId: expect.any(Number) });
    });

    test('Player joins with randomised name', () => {
      const result = reqPlayerJoin(session.sessionId, '');
      expect(result).toStrictEqual({ playerId: expect.any(Number) });
    });
  });

  describe('error cases', () => {
    test('Session does not refer to a valid session', () => {
      const result = reqPlayerJoin(session.sessionId + 100, 'Yang');
      expect(result).toStrictEqual({ error: 'Session Id does not refer to a valid session' });
    });

    test('Name of user entered is not unique', () => {
      const result = reqPlayerJoin(session.sessionId, 'Yang');
      expect(result).toStrictEqual({ error: 'Name of user entered is not unique' });
    });

    test('Session is not in LOBBY state', () => {
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'END', user.token);
      const result = reqPlayerJoin(session.sessionId, 'Josh');
      expect(result).toStrictEqual({ error: 'Session is not in LOBBY state' });
    });
  });
});

// Clear all objects at completion
afterAll(() => {
  clear();
});
