import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };

import {
  register,
  quizCreate,
  deleteQuiz,
  QuizList,
  QuizzesFromTrash,
} from './api';

/**
 * Eequests the Quiz Restore function.
 * @param { string } token - The user token for verification.
 * @param { number } quizId - The id of the quiz
 * @returns { object } response Object
 */

function quizRestoreTesting(token: string, quizId: number) {
  return request('POST', SERVER_URL + `/v1/admin/quiz/${quizId}/restore`, {
    json: {
      token: token,
    },
  });
}

describe('adminQuizRestore - Success Case', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Status 200 - Restore Quiz Success: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Retrieve the Quiz from trash
    const response = quizRestoreTesting(user.token, quiz.quizId);
    expect(response.statusCode).toBe(200);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual({});

    // Check the trash - which should be empty
    const checkTrashResponse = QuizzesFromTrash(user.token);
    expect(checkTrashResponse).toStrictEqual({ quizzes: [] });

    // Now check the quizzes list. The Restored quiz should be in the quizzes array.
    const checkquizzesResponse = QuizList(user.token);

    expect(checkquizzesResponse).toEqual({
      quizzes: [
        {
          name: expect.any(String),
          quizId: expect.any(Number),
        },
      ],
    });
  });
});

describe('400 Cases', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Status 400 - Quiz name of the restored quiz is already used by another active quiz: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Now create another quiz with the same name

    const quiz2 = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });

    // Retrieve Quiz from trash - should throw an error
    const response = quizRestoreTesting(user.token, quiz.quizId);
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });

  test('Status 400 - Quiz ID refers to a quiz that is not currently in the trash: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Retrieve Quiz from trash - should throw an error
    const randomNumber = 99;
    // Retrieve Quiz from trash - should throw an error
    const response = quizRestoreTesting(user.token, randomNumber);
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});

describe('400 Cases', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Status 400 - Quiz name of the restored quiz is already used by another active quiz: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Now create another quiz with the same name

    const quiz2 = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });

    // Retrieve Quiz from trash - should throw an error
    const response = quizRestoreTesting(user.token, quiz.quizId);
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });

  test('Status 400 - Quiz ID refers to a quiz that is not currently in the trash: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Retrieve Quiz from trash - should throw an error
    const randomNumber = 99;
    const response = quizRestoreTesting(user.token, randomNumber);
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});

describe('401 Case', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Status 401 - Invalid token: ', () => {
    // Create a new user.
    const user = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Now create another quiz with the same name

    const quiz2 = quizCreate(
      user.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });

    // Retrieve Quiz from trash - should throw an error
    const response = quizRestoreTesting('Invalid Token', quiz.quizId);
    expect(response.statusCode).toBe(401);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});

describe('403 Case', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });

  test('Status 403 - Valid token is provided, but user is not an owner of this quiz: ', () => {
    // Create users.
    const user1 = register(
      'HGindaHouse22@hogwarts.com',
      'Hocrux2387',
      'Ginny',
      'Weasley'
    );
    expect(user1).toEqual({ token: expect.any(String) });

    const user2 = register(
      'MajulaOblong66@hogwarts.com',
      'Licorice23',
      'Booyah',
      'JimJones'
    );
    expect(user2).toEqual({ token: expect.any(String) });

    // Then create a quiz
    const quiz = quizCreate(
      user1.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });

    // Send Quiz to trash
    const quizDelResponse = deleteQuiz(user1.token, quiz.quizId);
    expect(quizDelResponse).toEqual({});

    // Now create another quiz with the same name

    const quiz2 = quizCreate(
      user1.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });

    // Retrieve Quiz from trash - should throw an error
    const response = quizRestoreTesting(user2.token, quiz.quizId);
    expect(response.statusCode).toBe(403);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});
