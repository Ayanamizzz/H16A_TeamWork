import { adminAuthRegister } from './auth.js';
import { adminQuizCreate } from './quiz.js';
import { adminQuizInfo } from './quiz.js';
import { clear } from './other.js';
import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;



beforeEach(() => {
  request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});
});

/*
This is black box testing for adminQuizInfo.js
it get all of the relevant information about current quiz
It return error massage if 
- AuthUserId is ot a valid user
- Quiz ID does not refer to a valid quiz
- Quiz ID does not refer to a quiz that this user owns
*/
describe('adminQuizInfo', () => {
  describe('Test Success Case for adminQuizInfo', () => {
    test('All relevant information is correctly input', () => {
      const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'jackierandom231@gmail.com',
          password: 'jackierandom2313',
          firstName: 'Jackie',
          lastName: 'Random',
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
      const quizId = JSON.parse(quizCreateRes.body as string).quizId;

      const quizInfoRes = request('GET', `${url}:${port}/v1/admin/quiz/${quizId}`, {
        qs: { token },
      });
      const quizInfo = JSON.parse(quizInfoRes.body as string);

      expect(quizInfo).toMatchObject({
        quizId: quizId,
        name: 'This is the name of the quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This quiz is so we can have a lot of fun',
        numQuestions: 1,
        questions: [
          {
            questionId: questionId,
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answerId: answerId,
                answer: 'Prince Charles',
                colour: 'red',
                correct: true,
              },
            ],
          },
        ],
        duration: 44,
      });
    });
  });

  describe('Error Case for adminQuizInfo', () => {
    test('AuthUserId is not a valid user, It should return an error message for invaild AuthUser Id', () => {
      const authRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: 'email@example.com',
          password: 'password4455', 
          firstName: 'John',
          lastName: 'Doe',
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
          firstName: 'Jane',
          lastName: 'Doe',
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
    
    test("Quiz ID does not refer to a quiz that this user owns", () => {
      const user1AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: "user1@example.com",
          password: "password123",
          firstName: "User",
          lastName: "One",
        },
      });
      const user1Token = JSON.parse(user1AuthRes.body as string).token;

      const user2AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
        json: {
          email: "user2@example.com", 
          password: "password456",
          firstName: "User",
          lastName: "Two",
        },
      });
      const user2Token = JSON.parse(user2AuthRes.body as string).token;

      const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
        json: {
          token: user1Token, 
          name: "Quiz 1",
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
});