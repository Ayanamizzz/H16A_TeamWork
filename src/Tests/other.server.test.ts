import { port, url } from './../config.json';

const SERVER_URL = `${url}:${port}`;

import { deleteReq, registerReq, reqNewQuiz, reqModifyQuizThumbnail } from './api';

describe('DELETE/v1/clear', () => {
  test('Correct Output', () => {
    const result = deleteReq(`${SERVER_URL}/v1/clear`, {});
    expect(result).toStrictEqual({});
  });
  // This test is written to make sure we are correctly deleting images that are not .gitkeep
  test('correctly clears images', () => {
    const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
    const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
    reqModifyQuizThumbnail(
      newQuiz.quizId,
      'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      newToken.token
    );
    const result = deleteReq(`${SERVER_URL}/v1/clear`, {});
    expect(result).toStrictEqual({});
  });
});
