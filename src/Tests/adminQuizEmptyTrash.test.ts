import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
beforeEach(() => {
  // Reset before test.
  request('DELETE', `${url}:${port}/v1/clear`, {});
});

describe('Test invalid input of adminQuizEmptyTrash', () => {
  test('Test invalid token', () => {
    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    const token = JSON.parse(res1.body.toString()).token;

    const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz1',
        description: 'The first quiz'
      },
    });
    const quizId1 = JSON.parse(res2.body.toString()).quizId;

    const res3 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz2',
        description: 'The second quiz'
      },
    });
    const quizId2 = JSON.parse(res3.body.toString()).quizId;
    const quizIds = [quizId1, quizId2];

    const res4 = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
      json: {
        token: token + 1,
        quizIds: JSON.stringify(quizIds),
      },
    });

    expect(res4.statusCode).toStrictEqual(401);
    const result = JSON.parse(res4.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });

  test('Test one or more of the Quiz IDs is not currently in the trash', () => {
    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    const token = JSON.parse(res1.body.toString()).token;

    const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz1',
        description: 'The first quiz'
      },
    });
    const quizId1 = JSON.parse(res2.body.toString()).quizId;

    const res3 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz2',
        description: 'The second quiz'
      },
    });
    const quizId2 = JSON.parse(res3.body.toString()).quizId;
    const quizIds = [quizId1, quizId2];

    request('GET', `${url}:${port}/v1/admin/quiz/trash`, {
      json: {
        token: token,
      },
    });

    const res5 = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
      qs: {
        token: token,
        quizIds: JSON.stringify(quizIds),
      },
    });

    expect(res5.statusCode).toStrictEqual(400);
    const result = JSON.parse(res5.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });

  test('Test one or more of the Quiz IDs refers to a quiz that this current user does not own', () => {
    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    const token1 = JSON.parse(res1.body.toString()).token;

    const res2 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'adminMasu@gmail.com',
        password: '3989njsakjo',
        nameFirst: 'Key',
        nameLast: 'Lyu'
      },
    });
    const token2 = JSON.parse(res2.body.toString()).token;

    const res3 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token1,
        name: 'Quiz1',
        description: 'The first quiz'
      },
    });
    const quizId1 = JSON.parse(res3.body.toString()).quizId;

    const res4 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token2,
        name: 'Quiz2',
        description: 'The second quiz'
      },
    });
    const quizId2 = JSON.parse(res4.body.toString()).quizId;
    const quizIds = [quizId1, quizId2];

    const res5 = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
      qs: {
        token: token2,
        quizIds: JSON.stringify(quizIds),
      },
    });

    expect(res5.statusCode).toStrictEqual(400);
    const result = JSON.parse(res5.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Test successful adminQuizEmptyTrash', () => {
  beforeEach(() => {
    // Reset before test.
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });
  test('Test one or more of the Quiz IDs refers to a quiz that this current user does not own', () => {
    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'Linked@gmail.com',
        password: 'linked123456',
        nameFirst: 'Jack',
        nameLast: 'Wang'
      },
    });
    const token = JSON.parse(res1.body.toString()).token;

    const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz1',
        description: 'The first quiz'
      },
    });
    const quizId1 = JSON.parse(res2.body.toString()).quizId;

    const res3 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz2',
        description: 'The second quiz'
      },
    });
    const quizId2 = JSON.parse(res3.body.toString()).quizId;

    request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId1}`, {
      qs: {
        quizid: quizId1,
        token: token,
      },
    });

    request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId2}`, {
      qs: {
        quizid: quizId2,
        token: token,
      },
    });

    const quizIds = [quizId1, quizId2];

    const res4 = request('DELETE', `${url}:${port}/v1/admin/quiz/trash/empty`, {
      qs: {
        token: token,
        quizIds: JSON.stringify(quizIds),
      },
    });

    expect(res4.statusCode).toStrictEqual(200);
    const result = JSON.parse(res4.body.toString());
    expect(result).toStrictEqual({});
  });
});
