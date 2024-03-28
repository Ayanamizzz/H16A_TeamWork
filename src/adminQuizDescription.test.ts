import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizDescriptionUpdate } from './quiz.js';
import { clear } from './other.js';
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;

// Clear the database before each test
beforeEach(() => {
  request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});
});

/*
This is black box testing for adminQuizDescriptionUpdate function.
This function willUpdate the description of the relevant quiz.
It return an error massage if
-AuthUserId is not a valid user
-Quiz ID does not refer to a valid quiz
-Quiz ID does not refer to a quiz that this user owns
-Description is more than 100 characters in length (note: empty strings are OK)
*/

describe('PUT /v1/admin/quiz/{quizid}/description', () => {
  describe('Success Cases', () => {
    test('should update the quiz description when all inputs are valid', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'password23232',
          firstName: 'Jackie',
          lastName: 'Random',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Quiz Name', description: 'Original Description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const validDescription = 'This is the new description of the quiz, which is less than 100 characters long.';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/description`, {
        json: { token, description: validDescription },
      });
      expect(JSON.parse(updateRes.body as string)).toEqual({});
    });
  });

  describe('Failure Cases', () => {
    test('Token is empty or invalid', () => {
      const invalidToken = 'invalidToken';
      const validQuizId = 1;
      const validDescription = 'This is the new description of the quiz, which is less than 100 characters long.';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${validQuizId}/description`, {
        json: { token: invalidToken, description: validDescription },
      });
      expect(JSON.parse(updateRes.body as string).error).toEqual(expect.any(String));
    });

    test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'password4515',
          firstName: 'Jackie',
          lastName: 'Random',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;

      const invalidQuizId = -1;
      const validDescription = 'This is a valid description.';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${invalidQuizId}/description`, {
        json: { token, description: validDescription },
      });
      expect(JSON.parse(updateRes.body as string).error).toEqual(expect.any(String));
    });

    test('Description is longer than 100 characters', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'password1231231',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Quiz Name', description: 'Initial Description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const longDescription = 'This description is deliberately made longer than one hundred characters to test the validation logic of the update function ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/description`, {
        json: { token, description: longDescription },
      });
      expect(JSON.parse(updateRes.body as string).error).toEqual(expect.any(String));
    });
  });
});