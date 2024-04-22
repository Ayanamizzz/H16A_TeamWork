import { clear } from './other';
import {
  registerReq,
  reqNewQuiz,
  reqNewQuestion,
  reqNewSession,
  reqPlayerResults,
  reqPlayerJoin
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
const player = reqPlayerJoin(session.sessionId, 'Josh');

/*
Tests for GET/v1/admin/quiz/{quizid}/session/{sessionid}/results
Error Cases:
  - Player Id does not exist
  - Session is not in FINAL_RESULTS state

Success Cases:
  - Due to time contraints will not assess success cases

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/
describe('Tests for v1/player/{playerid}/results', () => {
  describe('Error cases', () => {
    test('playerId doesnt exist', () => {
      const result = reqPlayerResults(player.playerId + 100);
      expect(result).toStrictEqual({ error: 'PlayerId does not exist' });
    });
    test('Session is not in FINAL_RESULTS state', () => {
      const result = reqPlayerResults(player.playerId);
      expect(result).toStrictEqual({ error: 'Session is not in FINAL_RESULTS state' });
    });
  });
});

afterAll(() => {
  clear();
});
