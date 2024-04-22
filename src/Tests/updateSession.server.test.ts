import { clear } from './other';
import {
  newQuizWithQuestion,
  registerReq,
  reqNewSession,
  reqSessionStateUpdate,
  reqSessionList
} from './api';

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

clear();
const newQuiz = newQuizWithQuestion();
const UserNew = registerReq('cat1@email.com', 'Password45678', 'Hayden', 'HaydenTest');
const newSession1 = reqNewSession(newQuiz.quizId, 10, newQuiz.token);
const newSession2 = reqNewSession(newQuiz.quizId, 10, newQuiz.token);
reqNewSession(newQuiz.quizId, 10, newQuiz.token);

describe('/v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  describe('Test cases', () => {
    test('token is invalid', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, '');
      expect(res).toStrictEqual({ error: 'Token is not a valid structure' });
    });
    test('token is not for a current logged in session', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, '', '123');
      expect(res).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
    test('quizId is not a valid quiz', () => {
      const res = reqSessionStateUpdate(123, newSession1.sessionId, '', newQuiz.token);
      expect(res).toStrictEqual({ error: 'quizId does not refer to a valid quiz' });
    });
    test('quiz is not owned by user', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, '', UserNew.token);
      expect(res).toStrictEqual({ error: 'quizId does not refer to a quiz that this user owns' });
    });
    test('sessionId does not refer to valid session', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, 123451231, '', newQuiz.token);
      expect(res).toStrictEqual({ error: 'Session Id does not refer to a valid session within this quiz' });
    });
    test('action is not valid action', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, '', newQuiz.token);
      expect(res).toStrictEqual({ error: 'action is not valid Action' });
    });
    test('Action enum cannot be applied in the current state', () => {
      const res = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, 'END', newQuiz.token);
      expect(res).toStrictEqual({});
      const res1 = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, 'NEXT_QUESTION', newQuiz.token);
      const res2 = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, 'GO_TO_ANSWER', newQuiz.token);
      const res3 = reqSessionStateUpdate(newQuiz.quizId, newSession1.sessionId, 'GO_TO_FINAL_RESULTS', newQuiz.token);
      expect(res1).toStrictEqual({ error: 'Action enum cannot be applied in the current state (END)' });
      expect(res2).toStrictEqual({ error: 'Action enum cannot be applied in the current state (END)' });
      expect(res3).toStrictEqual({ error: 'Action enum cannot be applied in the current state (END)' });
    });
    test('Go through all states with no issues', () => {
      let res = reqSessionStateUpdate(newQuiz.quizId, newSession2.sessionId, 'NEXT_QUESTION', newQuiz.token);
      expect(res).toStrictEqual({});
      sleepSync(1100);
      res = reqSessionStateUpdate(newQuiz.quizId, newSession2.sessionId, 'GO_TO_ANSWER', newQuiz.token);
      expect(res).toStrictEqual({});
      res = reqSessionStateUpdate(newQuiz.quizId, newSession2.sessionId, 'GO_TO_FINAL_RESULTS', newQuiz.token);
      expect(res).toStrictEqual({});
    });
  });
});

describe('/v1/admin/quiz/{quizid}/sessions', () => {
  describe('Error Cases', () => {
    test('Token is not valid', () => {
      const res = reqSessionList(newQuiz.quizId);
      expect(res).toStrictEqual({ error: 'Token is not a valid structure' });
    });
    test('token is not for a current logged in session', () => {
      const res = reqSessionList(newQuiz.quizId, '123');
      expect(res).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
  });
  describe('Success Cases', () => {
    test('Correct Output', () => {
      const res = reqSessionList(newQuiz.quizId, newQuiz.token);
      expect(res).toStrictEqual({
        activeSessions: [expect.any(Number), expect.any(Number)],
        inactiveSessions: [newSession1.sessionId]
      });
    });
  });
});

afterAll(() => {
  clear();
});
