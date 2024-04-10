import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
const ERROR = { error: expect.any(String) };

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}', () => {
  let token: string;
  let quizId: number;
  let questionId: number;

  beforeAll(() => {
    // Create a new user and log in
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'test@example.com',
        password: 'password123',
        nameFirst: 'John',
        nameLast: 'Doe',
      },
    });
    const userData = JSON.parse(response.body.toString());
    token = userData.token;

    // Create a new quiz
    response = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: {
        token: token,
        name: 'Test Quiz',
        description: 'This is a test quiz',
      },
    });
    const quizData = JSON.parse(response.body.toString());
    quizId = quizData.quizId;

    // Create a new question
    response = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 10,
          points: 5,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'London', correct: false },
          ],
        },
      },
    });
    const questionData = JSON.parse(response.body.toString());
    questionId = questionData.questionId;
  });

  beforeEach(() => {
    // Clear the data store before each test if necessary
    request('DELETE', `${url}:${port}/v1/clear`, {});
  });

  test('Success: Returns empty object on successful update', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(200);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual({});
  });

  test('Error: Question Id does not refer to a valid question within this quiz', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/999`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Question string is less than 5 characters in length', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'Q?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Question string is greater than 50 characters in length', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France? This is a very long question.',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The question has more than 6 answers', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
            { answer: 'Madrid', correct: false },
            { answer: 'Rome', correct: false },
            { answer: 'London', correct: false },
            { answer: 'Lisbon', correct: false },
            { answer: 'Vienna', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The question has less than 2 answers', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The question duration is not a positive number', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: -15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 200,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The points awarded for the question are less than 1', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 0,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The points awarded for the question are greater than 10', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 11,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The length of any answer is shorter than 1 character long', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: '', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: The length of any answer is longer than 30 characters long', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris is the capital and most populous city of France.', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Any answer strings are duplicates of one another (within the same question)', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Paris', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: There are no correct answers', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Berlin', correct: false },
            { answer: 'London', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(400);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: 'invalidToken',
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(401);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Valid token is provided, but the quiz ID is invalid', () => {
    const response = request('PUT', `${url}:${port}/v1/admin/quiz/999/question/${questionId}`, {
      json: {
        token: token,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(403);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });

  test('Error: Valid token is provided, but the user does not own the quiz', () => {
    // Create a new user and log in
    let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'test2@example.com',
        password: 'password123',
        nameFirst: 'Jane',
        nameLast: 'Doe',
      },
    });
    const userData = JSON.parse(response.body.toString());
    const token2 = userData.token;

    response = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/question/${questionId}`, {
      json: {
        token: token2,
        questionBody: {
          question: 'What is the capital of France?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
          ],
        },
      },
    });
    expect(response.statusCode).toStrictEqual(403);
    const data = JSON.parse(response.body.toString());
    expect(data).toStrictEqual(ERROR);
  });
});

