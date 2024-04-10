import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

describe('adminQuizTrash', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Error: Token is empty or invalid.', () => {
    const trashResponse = request('GET', SERVER_URL + '/v1/admin/quiz/trash', {
      qs: { token: '' },
    });

    const trash = JSON.parse(trashResponse.body.toString());
    expect(trash).toStrictEqual({ error: expect.any(String) });
    expect(trashResponse.statusCode).toStrictEqual(401);
  });
/*
  test('Error: Token is empty or invalid.', () => {
    const restoreResponse = request('PUT', SERVER_URL + '/v1/admin/quiz/restore', {
      qs: { token: '' },
      json: { quizId: 123 }
    });

    const restoreResult = JSON.parse(restoreResponse.body.toString());

    expect(restoreResult).toStrictEqual({ error: expect.any(String) });
    expect(restoreResponse.statusCode).toStrictEqual(401);
  });
*/
});
/*
describe('successful to use adminQuizTrash', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('quiz in trash function successfully', () => {
    const register_Response = request('POST', SERVER_URL + '/v1/admin/auth/register', {
        json: {
          email: 'z5437798@gmail.com',
          password: 'Wind4ever',
          nameFirst: 'Ma',
          nameLast: 'Jin',
        },
      }
    );

    const user = JSON.parse(register_Response.body.toString());
    expect(user).toStrictEqual({ token: expect.any(String) });

    const Quiz_Response = request('POST', SERVER_URL + '/v1/admin/quiz', {
      json: {
        token: user.token,
        name: 'New Quiz',
        description: 'This is the description',
      },
    });

    const newQuiz = JSON.parse(Quiz_Response.body.toString());
    expect(newQuiz).toStrictEqual({ quizId: expect.any(Number) });

    const quizId = newQuiz.quizId;
    const remove_Quiz_Response = request('DELETE', SERVER_URL + `/v1/admin/quiz/${quizId}`, {
        qs: { token: user.token },
      }
    );
    const clear = JSON.parse(remove_Quiz_Response.body.toString());
    expect(clear).toStrictEqual({});

    const trashResponse = request('GET', SERVER_URL + `/v1/admin/quiz/trash`, {
      qs: { token: user.token },
    });

    const trash = JSON.parse(trashResponse.body.toString());
    expect(trash).toStrictEqual({
      quizzes: [
        {
          quizId: newQuiz.quizId,
          name: 'newQuiz'
        }
      ]
    });
    expect(trashResponse.statusCode).toStrictEqual(200);
  });
}) */
