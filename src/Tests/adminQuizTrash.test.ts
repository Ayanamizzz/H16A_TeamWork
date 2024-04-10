import request from 'sync-request-curl';
import config from '../config.json';
import {
  register,
  deleteQuiz,
  quizCreate,
} from './api';

function getQuizTrashTesting(token: string) {
  return request('GET', SERVER_URL + '/v1/admin/quiz/trash', {
    qs: {
      token: token,
    },
  });
}

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };

describe('adminQuizTrashView', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  // Test with empty or invalid token.
  test('Error: Token is empty or invalid.', () => {
    const trashResponse = getQuizTrashTesting('Invalid token');
    const trashData = JSON.parse(trashResponse.body.toString());
    expect(trashResponse.statusCode).toStrictEqual(401);
    expect(trashData).toStrictEqual(ERROR);
  });

  test('200 Success: View quizzes in trash successfully', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toStrictEqual({
      token: expect.any(String),
    });
    // Create the quiz.
    const quiz = quizCreate(user.token, 'New Quiz', 'This is the description');
    expect(quiz).toStrictEqual({ quizId: expect.any(Number) });

    // Delete the quiz.
    const deleteResponse = deleteQuiz(user.token, quiz.quizId);
    expect(deleteResponse).toStrictEqual({});
    // Call the empty trash function
    const deletedData = getQuizTrashTesting(user.token);
    expect(deletedData.statusCode).toStrictEqual(200);
    const trashData = JSON.parse(deletedData.body.toString());
    const quizId = quiz.quizId;

    // Check that the quiz is in the trash.
    expect(trashData).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'New Quiz',
        },
      ],
    });
  });
});
