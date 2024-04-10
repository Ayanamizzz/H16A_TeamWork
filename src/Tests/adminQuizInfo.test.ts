import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

describe('Error Case for adminQuizInfo', () => {
  beforeEach(() => {
    // Reset before test.
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  test('AuthUserId is not a valid user, It should return an error message for invaild AuthUser Id', () => {
    const authRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'email@example.com',
        password: 'password4455',
        nameFirst: 'John',
        nameLast: 'Doe',
      },
    });
    const token = JSON.parse(authRes.body as string).token;

    const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz 1',
        description: 'This is a quiz',
      },
    });
    const quizId = JSON.parse(quizCreateRes.body as string).quizId;

    const invalidToken = 'invalidToken';
    const quizInfoRes = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}`, {
      qs: { token: invalidToken },
    });
    const quizInfo = JSON.parse(quizInfoRes.body as string);
    expect(quizInfo.error).toStrictEqual(expect.any(String));
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const authRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'user@example.com',
        password: 'password123',
        nameFirst: 'Jane',
        nameLast: 'Doe',
      },
    });
    const token = JSON.parse(authRes.body as string).token;

    const invalidQuizId = 'invalidQuizId';
    const quizInfoRes = request('GET', `${url}:${port}/v1/admin/quiz/${invalidQuizId}`, {
      qs: { token },
    });
    const quizInfo = JSON.parse(quizInfoRes.body as string);
    expect(quizInfo.error).toStrictEqual(expect.any(String));
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const user1AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'user1@example.com',
        password: 'password123',
        nameFirst: 'User',
        nameLast: 'One',
      },
    });
    const user1Token = JSON.parse(user1AuthRes.body as string).token;

    const user2AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'user2@example.com',
        password: 'password456',
        nameFirst: 'User',
        nameLast: 'Two',
      },
    });
    const user2Token = JSON.parse(user2AuthRes.body as string).token;

    const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: user1Token,
        name: 'Quiz 1',
        description: "This is User1's quiz",
      },
    });
    const quizId = JSON.parse(quizCreateRes.body as string).quizId;

    const quizInfoRes = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}`, {
      qs: { token: user2Token },
    });
    const quizInfo = JSON.parse(quizInfoRes.body as string);
    expect(quizInfo.error).toStrictEqual(expect.any(String));
  });
});

describe('Test Success Case for adminQuizInfo', () => {
  test('All relevant information is correctly input', () => {
    // Reset before test.
    request('DELETE', `${url}:${port}/v1/clear`, {});
    const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'jackierandom231@gmail.com',
        password: 'jackierandom2313',
        nameFirst: 'Jackie',
        nameLast: 'Random',
      },
    });
    const token = JSON.parse(authRegisterRes.body as string).token;

    const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Quiz 1',
        description: 'This is a quiz',
      },
    });

    const returnData = JSON.parse(quizCreateRes.body.toString());
   
    expect(quizCreateRes.statusCode).toStrictEqual(200);
    const quizId = JSON.parse(quizCreateRes.body as string).quizId;

    const quizInfoRes = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}`, {
      qs: { token },
    });
    const quizInfo = JSON.parse(quizInfoRes.body as string);
 
    expect(quizInfo).toMatchObject({
      quizId: quizId,
      name: 'Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'This is a quiz',
      numQuestions: 0,
      questions: [

      ],
      duration: 0,
    });
  });
});
