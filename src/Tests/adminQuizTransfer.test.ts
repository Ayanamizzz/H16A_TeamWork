import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

describe('POST /v1/admin/quiz/{quizid}/transfer', () => {
  let token1:string;
  let token2:string;
  let quizId1:number;
  let quizId2:number;
  beforeEach(() => {
    // Reset before test.
    request('DELETE', `${url}:${port}/v1/clear`, {});
    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    token1 = JSON.parse(res1.body.toString()).token;
    const res2 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail2.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    token2 = JSON.parse(res2.body.toString()).token;
    const res11 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token1,
        name: 'Quiz1',
        description: 'The first quiz'
      },
    });

    expect(res11.statusCode).toStrictEqual(200);
    const bodyObj2 = JSON.parse(res11.body.toString());
    expect(bodyObj2).toStrictEqual({ quizId: expect.any(Number) });
    quizId1 = bodyObj2.quizId;

    const res22 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token2,
        name: 'Quiz122',
        description: 'The first22 quiz'
      },
    });

    expect(res22.statusCode).toStrictEqual(200);
    const bodyObj22 = JSON.parse(res22.body.toString());
    expect(bodyObj22).toStrictEqual({ quizId: expect.any(Number) });
    quizId2 = bodyObj22.quizId;
  });

  test('This function returns Correct object', () => {
    const targetUserEmail2 = 'Linked@gmail2.com';

    const response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail2
      }
    });

    expect(response.statusCode).toStrictEqual(200);
    const bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ });
  });

  test('userEmail is not exist', () => {
    const targetUserEmail = 'Linssssked@gmail.com';

    const response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(400);
    const bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });
  });

  test('userEmail is the current logged in user', () => {
    const targetUserEmail = 'Linked@gmail.com';

    const response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(400);
    const bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });
  });

  test('token eroor', () => {
    const targetUserEmail = 'Linked@gmail2.com';

    let response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: '',
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(401);
    let bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });

    response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: 'sssssssss',
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(401);
    bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });

    response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1 + 100}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(403);
    bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });

    response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId2}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail
      }
    });

    expect(response.statusCode).toStrictEqual(403);
    bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });
  });

  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const res22 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token2,
        name: 'Quiz1',
        description: 'The first22 quiz'
      },
    });

    const bodyObj22 = JSON.parse(res22.body.toString());

    expect(res22.statusCode).toStrictEqual(200);
    expect(bodyObj22).toStrictEqual({ quizId: expect.any(Number) });

    const targetUserEmail2 = 'Linked@gmail2.com';

    const response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId1}/transfer`, {
      json: {
        token: token1,
        userEmail: targetUserEmail2
      }
    });

    expect(response.statusCode).toStrictEqual(400);
    const bodyObj = JSON.parse(response.body.toString());
    expect(bodyObj).toStrictEqual({ error: expect.any(String) });
  });
});
