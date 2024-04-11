import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

describe('Test invalid input of adminQuizQuestionDelete', () => {
  let token: string;
  let quizId: number;
  let questionId: number;
  beforeEach(() => {
    // Clear any setup or data before each test
    request('DELETE', `${url}:${port}/v1/clear`, {}); // Clear data before each test
    // Register the user
    const userResponse = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'test@example.com',
        password: 'password1378',
        nameFirst: 'John',
        nameLast: 'Wang'
      }
    });
    const userData = JSON.parse(userResponse.body.toString());
    token = userData.token;

    // Create a quiz
    const quizResponse = request('POST', `${url}:${port}/v1/admin/quiz`, {

      json: {
        token: token,
        name: 'Test Quiz',
        description: 'A description of my quiz'
      }
    });
    const quizData = JSON.parse(quizResponse.body.toString());

    quizId = quizData.quizId;

    const requestBody = {
      token,
      questionBody: {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'King Charles',
            correct: true
          },
          {
            answer: 'King Phillip',
            correct: false
          },
          {
            answer: 'Queen Elizabeth',
            correct: false
          },
          {
            answer: 'Bob',
            correct: false
          }
        ]
      }
    };
    const questionResponse = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`, {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const questionDat = JSON.parse(questionResponse.body.toString());

    questionId = questionDat.questionId;
  });

  test('Test invalid token', () => {
    const res4 = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      qs: {
        token: '',
      },
    }
    );
    expect(res4.statusCode).toStrictEqual(401);
    const result = JSON.parse(res4.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });

  test('Test invalid quizId', () => {
    const res4 = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId + 100}/question/${questionId}`, {
      qs: {
        token: token,
      },
    }
    );
    expect(res4.statusCode).toStrictEqual(403);
    const result = JSON.parse(res4.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });

  test('Test invalid questionId', () => {
    const res4 = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId + 1000}`, {
      qs: {
        token: token,
      },
    }
    );
    expect(res4.statusCode).toStrictEqual(400);
    const result = JSON.parse(res4.body.toString());
    expect(result).toStrictEqual({ error: expect.any(String) });
  });
});
