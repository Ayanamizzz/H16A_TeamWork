import { clear } from './other';
import {
  reqNewQuiz,
  registerReq,
  reqNewQuestion,
  reqNewSession,
  reqSessionStateUpdate,
  reqPlayerJoin,
  requestSubmitAnswer,
  reqPlayerQuestionInfo
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
      duration: 10,
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

describe('/v1/player/{playerid}/question/{questionposition}/answer', () => {
  describe('Error Cases', () => {
    test('playerId does not exist', () => {
      const res = requestSubmitAnswer(12345, 0, [123]);
      expect(res).toStrictEqual({ error: 'playerId does not exist' });
    });
    test('session must be in QUESTION_OPEN state', () => {
      const res = requestSubmitAnswer(player.playerId, 0, [123]);
      expect(res).toStrictEqual({ error: 'session must be in QUESTION_OPEN state' });
    });
    test('session is not up yet this question yet', () => {
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'NEXT_QUESTION', user.token);
      sleepSync(100);
      const res = requestSubmitAnswer(player.playerId, 10, [123]);
      expect(res).toStrictEqual({ error: 'session is not yet up to this question' });
    });
    test('answerId is not valid for this particular question', () => {
      const res = requestSubmitAnswer(player.playerId, 0, [123]);
      expect(res).toStrictEqual({ error: 'answerId is not valid for this particular question' });
    });
    test('duplicate answerId', () => {
      const quizInfo = reqPlayerQuestionInfo(player.playerId, 0);
      const validAnswer = quizInfo.answers[0].answerId;
      const res = requestSubmitAnswer(player.playerId, 0, [validAnswer, validAnswer]);
      expect(res).toStrictEqual({ error: 'there are duplicate answer IDs provided ' });
    });
    test('no answers sent', () => {
      const res = requestSubmitAnswer(player.playerId, 0, []);
      expect(res).toStrictEqual({ error: 'there is less than 1 answer ID submitted' });
    });
  });
  describe('Success Cases', () => {
    test('Correct Output', () => {
      const quizInfo = reqPlayerQuestionInfo(player.playerId, 0);
      const validAnswer = quizInfo.answers[0].answerId;
      const res = requestSubmitAnswer(player.playerId, 0, [validAnswer]);
      expect(res).toStrictEqual({});
    });
  });
});
