import { clear } from './other';
import {
  registerReq,
  reqNewQuiz,
  reqNewQuestion,
  reqNewSession,
  reqPlayerJoin,
  reqQuestionResults,
  reqSessionStateUpdate
} from './api';

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

clear();
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
const quiz = reqNewQuiz('This is the name of the quiz', 'This quiz is so that we can have a lot of fun', user.token);
reqNewQuestion(
  quiz.quizId,
  {
    questionBody: {
      question: 'Who is the Monarch of England?',
      duration: 1,
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
      question: 'Who is the Monarch of England?',
      duration: 1,
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
const player = reqPlayerJoin(session.sessionId, 'Yang');

describe('/v1/player/{playerid}/question/{questionposition}/results', () => {
  describe('Error Cases', () => {
    test('playerId does not exist', () => {
      const res = reqQuestionResults(12345, 0);
      expect(res).toStrictEqual({ error: 'playerId does not exist' });
    });
    test('quizPosition is not valid for the session this player is in', () => {
      const res = reqQuestionResults(player.playerId, 100000);
      expect(res).toStrictEqual({ error: 'questionPosition is not valid for the session this player is in' });
    });
    test('Session is not in ANSWER_SHOW state', () => {
      const res = reqQuestionResults(player.playerId, 0);
      expect(res).toStrictEqual({ error: 'sesison must be in ANSWER_SHOW state' });
    });
    test('session is not yet up to this question', () => {
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'NEXT_QUESTION', user.token);
      sleepSync(1100);
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'GO_TO_ANSWER', user.token);
      const res = reqQuestionResults(player.playerId, 1);
      expect(res).toStrictEqual({ error: 'session is not up to this question' });
    });
  });
  describe('Success Caes', () => {
    test('correct output', () => {
      const res = reqQuestionResults(player.playerId, 0);
      expect(res).toStrictEqual({
        questionId: expect.any(Number),
        averageAnswerTime: expect.any(Number),
        percentCorrect: expect.any(Number),
        questionCorrectBreakdown: [
          {
            answerId: expect.any(Number),
            playersCorrect: [
              expect.any(String)
            ]
          }
        ]
      });
    });
  });
});
