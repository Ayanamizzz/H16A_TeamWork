import { clear } from './other';
import {
  registerReq, reqNewQuiz, reqNewQuestion,
  reqNewSession, reqPlayerJoin, reqPlayerQuestionInfo,
  reqSessionStateUpdate, reqSessionStateUpdateForOriginRes, stringToObjection
} from './api';

// Clear Objects before
clear();

// Set up test objects
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
const quiz = reqNewQuiz('This is the name of the quiz', 'This quiz is so that we can have a lot of fun', user.token);
const question1 = reqNewQuestion(
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
const question2 = reqNewQuestion(
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
reqPlayerJoin(session.sessionId, 'Josh');
const player2 = reqPlayerJoin(session.sessionId, 'User123');
const session2 = reqNewSession(quiz.quizId, 10, user.token);
const player3 = reqPlayerJoin(session2.sessionId, 'Josh');
reqPlayerJoin(session2.sessionId, 'User123');
const session3 = reqNewSession(quiz.quizId, 10, user.token);
const player5 = reqPlayerJoin(session3.sessionId, 'Josh');

describe('Tests for v1/player/{playerid}/{question}/{questionposition}', () => {
  describe('Error cases', () => {
    test('PlayerId does not exist', () => {
      const result = reqPlayerQuestionInfo(player2.playerId + 100, 0);
      expect(result).toStrictEqual({ error: 'PlayerId does not exist' });
    });
    test('question position is not valid for the session this player is in', () => {
      const result = reqPlayerQuestionInfo(player2.playerId, -1);
      expect(result).toStrictEqual({ error: 'question position is not valid for the session this player is in' });
    });
    test('Session in LOBBY', () => {
      const result = reqPlayerQuestionInfo(player2.playerId, 0);
      expect(result).toStrictEqual({ error: 'Session is in LOBBY or END state' });
    });
    test('Session in END', () => {
      reqSessionStateUpdate(quiz.quizId, session.sessionId, 'END', user.token);
      const result = reqPlayerQuestionInfo(player2.playerId, 0);
      expect(result).toStrictEqual({ error: 'Session is in LOBBY or END state' });
    });
    test('Not current question', async () => {
      reqSessionStateUpdate(quiz.quizId, session2.sessionId, 'NEXT_QUESTION', user.token);
      // Pause 0.15 seconds to allow duration to work
      sleepSync(4.1 * 1000);
      const result = reqPlayerQuestionInfo(player3.playerId, 1);
      expect(result).toStrictEqual({ error: 'question position is not the current question' });
    });
  });

  describe('Success cases', () => {
    // This is an async test such that we approparitely wait for duration tickover.
    test('Correct return object', async () => {
      reqSessionStateUpdate(quiz.quizId, session3.sessionId, 'NEXT_QUESTION', user.token);
      const result = reqPlayerQuestionInfo(player5.playerId, 0);
      expect(result).toStrictEqual({
        questionId: question1.questionId,
        question: 'Who is the Monarch of England?',
        duration: expect.any(Number),
        points: expect.any(Number),
        thumbnailUrl: expect.any(String),
        answers: [
          {
            answerId: expect.any(Number),
            answer: 'Prince Charles',
            colour: expect.anything(),
          },
          {
            answerId: expect.any(Number),
            answer: 'Bob from wellington',
            colour: expect.anything(),
          }
        ]
      });
      const requestResult2 = reqSessionStateUpdate(quiz.quizId, session3.sessionId, 'FINISH_COUNTDOWN', user.token);
      expect(requestResult2).toStrictEqual({});
      // Pause for duration
      sleepSync(1000 * 5);

      const requestResult = reqSessionStateUpdateForOriginRes(quiz.quizId, session3.sessionId, 'NEXT_QUESTION', user.token);
      if (requestResult.statusCode === 400) {
        const stringToObjection1 = stringToObjection(requestResult);
        expect(stringToObjection1.error).toStrictEqual('Action enum cannot be applied in the current state (QUESTION_OPEN)');
      } else if (requestResult.statusCode === 200) {
        const result2 = reqPlayerQuestionInfo(player5.playerId, 1);
        expect(result2).toStrictEqual({
          questionId: question2.questionId,
          question: 'Is this a question?',
          duration: expect.any(Number),
          points: expect.any(Number),
          thumbnailUrl: expect.any(String),
          answers: [
            {
              answerId: expect.any(Number),
              answer: 'you tell me',
              colour: expect.anything(),
            },
            {
              answerId: expect.any(Number),
              answer: 'yes',
              colour: expect.anything(),
            }
          ]
        });
      }
    });
  });
});

afterAll(() => {
  clear();
});

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

afterAll(() => {
  clear();
});
