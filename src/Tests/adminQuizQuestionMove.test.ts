import request from 'sync-request-curl';
import config from '../config.json';

// Define variables using values from the config
const port = config.port;
const url = config.url;

// Define constant for the expected structure of error responses
const ERROR = { error: expect.any(String) }; // Error response structure

describe('adminQuizQuestionMove Functionality', () => {
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

  test('Fails with an invalid token', () => {
    const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
      json: {
        token: 'invalid_token',

        newPosition: 2,
      },
    });
    expect(res.statusCode).toStrictEqual(401);
    const body = JSON.parse(res.body.toString());
    expect(body).toEqual(ERROR);
  });

  test('Fails with an empty token', () => {
    const res = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/move`, {
      json: {
        token: '',
        newPosition: 1,
      },
    });
    expect(res.statusCode).toStrictEqual(401);
    const body = JSON.parse(res.body.toString());
    expect(body).toEqual(ERROR);
  });
});
