import request from 'sync-request-curl';
import config from '../config.json';

// Define variables using values from the config
const port = config.port; // Assign port number from config
// const curl = config.curl; // Assign curl from config
const url = config.url; // Assign url from config

// Define constant for error response structure

describe('quizQuestionDuplicate function', () => {
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

  // Test for successful question duplication
  test('Successful question duplication', () => {
    // Call the quizQuestionDuplicate function
    const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, {
      json: {
        token: token,
      },
    }
    );

    // Assert the result
    expect(res.statusCode).toStrictEqual(200);
  });

  // Test for invalid token
  test('Token is empty or invalid', () => {
    // Call the quizQuestionDuplicate function with an empty token
    // Call the quizQuestionDuplicate function
    const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, {
      json: {
        token: '',
      },
    }
    );

    // Assert the result
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });

  // Test for invalid quiz ID
  test('Invalid quizId', () => {
    // Call the quizQuestionDuplicate function
    const res = request('POST', `${url}:${port}/v1/admin/quiz/xxxx/question/${questionId}/duplicate`, {
      json: {
        token
      },
    }
    );

    // Assert the result
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });

  // Test for invalid question ID
  test('Invalid questionId', () => {
    const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question/1questionId/duplicate`, {
      json: {
        token
      },
    }
    );
    // Assert the result
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });

  // Test when the quiz does not belong to the current user
  test('Quiz does not belong to the current user', () => {
    // Register a user
    const userResponse1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'test@exampl111e.com',
        password: 'passw2ord123',
        nameFirst: 'John',
        nameLast: 'Doe'
      }
    });
    const userData = JSON.parse(userResponse1.body.toString());
    const userToken = userData.token;

    // Create a quiz
    const quizResponse = request('POST', `${url}:${port}/v1/admin/quiz`, {
      headers: {
        token: userToken
      },
      json: {
        title: 'Test Quiz',
        questions: [{ questionId: 1, text: 'Original question' }]
      }
    });
    const quizData = JSON.parse(quizResponse.body.toString());

    const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizData.quizid}/question/1questionId/duplicate`, {
      json: {
        token,
      },
    }
    );

    // Assert the result
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});
