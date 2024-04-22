import { clear } from './other';
import { newQuizWithQuestion, reqNewSession, registerReq, reqNewQuiz } from './api';

clear();
const newQuiz = newQuizWithQuestion();

describe('/v1/admin/quiz/{quizid}/session/start', () => {
  describe('Success Cases', () => {
    test('Correct Output', () => {
      const result = reqNewSession(newQuiz.quizId, 10, newQuiz.token);
      expect(result).toStrictEqual({ sessionId: expect.any(Number) });
    });
  });
  describe('Error Cases', () => {
    test('Token is invalid structure', () => {
      const result = reqNewSession(123, 10);
      expect(result).toStrictEqual({ error: 'Token is not a valid structure' });
    });
    test('Token is not for logged in session', () => {
      const result = reqNewSession(123, 10, '12345');
      expect(result).toStrictEqual({
        error: 'Provided token is a valid structure, but is not for a currently logged in session'
      });
    });
    test('quizId does not refer to valid quiz', () => {
      const result = reqNewSession(12345, 10, newQuiz.token);
      expect(result).toStrictEqual({
        error: 'quizId does not refer to a valid quiz'
      });
    });
    test('quizId does not refer to a quiz this user owns', () => {
      const newToken = registerReq('cat2@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      const result = reqNewSession(newQuiz.quizId, 10, newToken.token);
      expect(result).toStrictEqual({
        error: 'quizId does not refer to a quiz that this user owns'
      });
    });
    test('autoStartNum is greater than 50', () => {
      const result = reqNewSession(newQuiz.quizId, 51, newQuiz.token);
      expect(result).toStrictEqual({
        error: 'autoStartNum mast be less than 50'
      });
    });
    test('Quiz has 0 questions', () => {
      const noQuestionQuiz = reqNewQuiz('Quiz100', '', newQuiz.token);
      const result = reqNewSession(noQuestionQuiz.quizId, 10, newQuiz.token);
      expect(result).toStrictEqual({
        error: 'quiz must have at least 1 question'
      });
    });
    test('Already 10 sessions', () => {
      // const newQuiz = newQuizWithQuestion();
      for (let i = 0; i < 9; i++) {
        reqNewSession(newQuiz.quizId, 10, newQuiz.token);
      }
      const result = reqNewSession(newQuiz.quizId, 10, newQuiz.token);
      expect(result).toStrictEqual({
        error: 'already 10 sessions that are not in END state currently exist'
      });
    });
  });
});

afterAll(() => {
  clear();
});
