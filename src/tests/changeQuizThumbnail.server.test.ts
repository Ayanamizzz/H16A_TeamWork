import { clear } from './other';
import { reqModifyQuizThumbnail, reqNewQuiz, registerReq } from './api';

beforeEach(() => {
  clear();
});

describe('/v1/admin/quiz/{quizid}/thumbnail', () => {
  describe('Success Cases', () => {
    test('Correct Output', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
      const result = reqModifyQuizThumbnail(
        newQuiz.quizId,
        'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
        newToken.token
      );
      expect(result).toStrictEqual({});
    });
  });
  describe('Error Cases', () => {
    test('Token is not valid', () => {
      const result = reqModifyQuizThumbnail(12345, '');
      expect(result).toStrictEqual({ error: 'Token is not a valid structure' });
    });
    test('Token is valid but not for session', () => {
      const result = reqModifyQuizThumbnail(12345, '', '12345');
      expect(result).toStrictEqual({
        error: 'Provided token is a valid structure, but is not for a currently logged in session'
      });
    });
    test('quizId does not refer to a valid quiz', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const result = reqModifyQuizThumbnail(12345, '', newToken.token);
      expect(result).toStrictEqual({ error: 'quizId does not refer to a valid quiz' });
    });
    test('quizId does not refer to a quiz that this user owns', () => {
      const newToken1 = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newToken2 = registerReq('cat2@email.com', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', '', newToken1.token);
      const result = reqModifyQuizThumbnail(newQuiz.quizId, '', newToken2.token);
      expect(result).toStrictEqual({
        error: 'quizId does not refer to a quiz that this user owns'
      });
    });
    test('File is not jpeg or png', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
      const result = reqModifyQuizThumbnail(newQuiz.quizId, '', newToken.token);
      expect(result).toStrictEqual({
        error: 'imageUrl must return PNG or JPG'
      });
    });
  });
});

afterAll(() => {
  clear();
});
