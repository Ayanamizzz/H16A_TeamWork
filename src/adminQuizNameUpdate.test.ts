import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizNameUpdate } from './quiz.js';
import { clear } from './other.js';
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;

beforeEach(() => {
  request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});
});

/*
This is black box testing for adminQUIZNameUpdate function.
this function aim to update the name of the relevant quiz.
It return erroe massage if
- authUserId is not a valid user
- quizId does not refer to a valid quiz
- quizId does not refer to a quiz that this user owns
- name contains any characters that are not alphanumeric or are spaces
- name is less than 3 characters long
- name is longer than 30 characters long
- name is already used by the current logged in user for another quiz
*/
ddescribe('PUT /v1/admin/quiz/{quizid}/name', () => {
  describe('Success Cases', () => {
    test('name is exactly 3 characters long', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token, name: 'LOL' },
      });
      expect(JSON.parse(updateRes.body as string)).toEqual({});
    });

    test('name more than 3 but less than 30 characters long', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token, name: 'LOLILovePizza' },
      });
      expect(JSON.parse(updateRes.body as string)).toEqual({});
    });
  });

  describe('Error Cases', () => {
    test('Token is empty or invalid', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const invalidToken = 'invalidToken';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token: invalidToken, name: 'New Name' },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });

    test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
      const user1AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'user1@example.com',
          password: 'password123',
          firstName: 'User',
          lastName: 'One',
        },
      });
      const token1 = JSON.parse(user1AuthRes.body as string).token;

      const user2AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'user2@example.com',
          password: 'password456',
          firstName: 'User',
          lastName: 'Two',
        },
      });
      const token2 = JSON.parse(user2AuthRes.body as string).token;

      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token: token1, name: 'User1 Quiz', description: 'Description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token: token2, name: 'New Name' },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });

    test('Name contains invalid characters', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const invalidName = 'InvalidName@#$%^&*';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token, name: invalidName },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });

    test('Name is less than 3 characters long', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const shortName = 'No';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token, name: shortName },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });

    test('Name is longer than 30 characters', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Original Quiz Name', description: 'A description' },
      });
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const longName = 'This Quiz Name Is Definitely Way Too Long';
      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
        json: { token, name: longName },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'validemail@example.com',
          password: 'validPassword123',
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      const token = JSON.parse(authRegisterRes.body as string).token;
      
      const quiz1CreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Unique Name', description: 'Description for the first quiz' },
      });
      const quiz1Id = JSON.parse(quiz1CreateRes.body as string).quizId;

      const quiz2CreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: { token, name: 'Another Unique Name', description: 'Description for the second quiz' },
      });
      const quiz2Id = JSON.parse(quiz2CreateRes.body as string).quizId;

      const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quiz2Id}/name`, {
        json: { token, name: 'Unique Name' },
      });
      expect(JSON.parse(updateRes.body as string).error).toStrictEqual(expect.any(String));
    });
  });
});