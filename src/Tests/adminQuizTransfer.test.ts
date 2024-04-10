import { clear } from '../other';
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;


const postRequest = (url: string, data: any) => {
  const res = request('POST', url, { json: data });
  return JSON.parse(res.body.toString());
};

const deleteRequest = (url: string, data: any) => {
  const res = request('DELETE', url, { qs: data });
  return JSON.parse(res.body.toString());
};


const getRequest = (url: string, data: any) => {
  const res = request('GET', url, { qs: data });
  return JSON.parse(res.body.toString());
};

/*
Tests for /v1/admin/quiz/{quizid}/transfer
This function Transfer ownership of a quiz to a different user based on their email
Success Cases:
  - This function returns Correct object
  - This function has transfers quiz to user with quizzes
Error Cases:
  - userEmail is not a real user
  - userEmail is the current loggined in user (transfering ownership to self)
  - Quiz Id refers to a quiz that has a name that is already used by the target user
  - Any session for this quiz is not in END state
  - Token is empty or invalid (does not refer to valid logged in user session)
  - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
*/

beforeEach(() => {
  request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});
});



describe('POST /v1/admin/quiz/{quizid}/transfer', () => {
  // 成功案例
  describe('Success Cases', () => {
    test('This function returns Correct object', () => {
      // 假设存在一个有效的token，quizId，并且目标用户email存在且具备转移条件
      const validToken = 'validToken';
      const quizId = 1; // 假设quizId为1的测试数据已经存在
      const targetUserEmail = 'target@example.com'; // 目标用户的邮箱

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: targetUserEmail
      });

      // 检查返回的对象是否正确
      expect(response).toStrictEqual({});
    });

    test('This function has transfers quiz to user with quizzes', () => {
      const validToken = 'validToken';
      const quizId = 2; // 假设quizId为2的测试数据已经存在
      const targetUserEmail = 'existing@example.com'; // 已有测验的目标用户邮箱

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: targetUserEmail
      });

      // 检查是否成功转移，这可能需要查询数据库或调用其他API验证
      expect(response).toStrictEqual({});
    });
  });

  describe('Error Cases', () => {
    test('userEmail is not a real user', () => {
      const validToken = 'validToken';
      const quizId = 3;
      const fakeUserEmail = 'fakeuser@example.com'; // 不存在的用户邮箱

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: fakeUserEmail
      });

      expect(response).toEqual({ error: 'userEmail is not a real user' });
    });

    test('userEmail is the current logged in user', () => {
      const validToken = 'validToken';
      const quizId = 4;
      const selfEmail = 'self@example.com'; // 假设这是当前登录用户的邮箱

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: selfEmail
      });

      expect(response).toEqual({ error: 'userEmail is the current logged in user' });
    });

    test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      const validToken = 'validToken';
      const quizId = 5; // 假设这个quizId的测验名称已被目标用户使用
      const targetUserEmail = 'target@example.com';

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: targetUserEmail
      });

      expect(response).toEqual({ error: 'Quiz ID refers to a quiz that has a name that is already used by the target user' });
    });

    test('Any session for this quiz is not in END state', () => {
      const validToken = 'validToken';
      const quizId = 6; // 假设这个quizId的某个session不在END状态
      const targetUserEmail = 'target@example.com';

      const response = postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/transfer`, {
        token: validToken,
        userEmail: targetUserEmail
      });

      expect(response).toEqual({ error: 'Any session for this quiz is not in END state' });
    });
  });
});
