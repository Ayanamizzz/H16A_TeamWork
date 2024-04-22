import { clear } from './other';
import { State } from './../dataStore';
import {
  registerReq,
  reqNewQuiz,
  reqNewQuestion,
  reqNewSession,
  reqPlayerJoin,
  reqPlayerStatus
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
reqPlayerJoin(session.sessionId, 'Josh');
const player2 = reqPlayerJoin(session.sessionId, 'Hayden');

describe('Tests for v1/player/{playerid}', () => {
  describe('Success cases', () => {
    test('Correct return object', () => {
      const result = reqPlayerStatus(player2.playerId);
      expect(result).toStrictEqual({
        state: State.LOBBY,
        atQuestion: 0
      });
    });
  });

  describe('Error cases', () => {
    test('playerId doesnt exist', () => {
      const result = reqPlayerStatus(player2.playerId + 100);
      expect(result).toStrictEqual({ error: 'PlayerId does not exist' });
    });
  });
});

afterAll(() => {
  clear();
});
