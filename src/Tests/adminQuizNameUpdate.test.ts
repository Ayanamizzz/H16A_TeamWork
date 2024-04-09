import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;


describe('Success Cases', () => {
  test('success', () => {
    request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});

    const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
      json: {
        email: 'validemail@example.com',
        password: 'validPassword123',
        nameFirst: 'John',
        nameLast: 'Doe',
      },
    });
    const body1 = JSON.parse(res1.body.toString());
    const token = body1.token;

    const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
      json: { 
        token: token, 
        name: 'quiz1', 
        description: 'A description' 
      },
    });
    const body2 = JSON.parse(res2.body.toString());
    const quizId = body2.quizId;

    const res3 = request('PUT', `${url}:${port}/v1/admin/quiz/{quizId}/name`, {
      json: { 
        token: token, 
        quizId: quizId, 
        name: 'quiz2' 
      },
    });

    expect(res3.statusCode).toStrictEqual(200);
    const body3 = JSON.parse(res3.body.toString());
    expect(body3).toStrictEqual({});
  });
  
});

// describe('Success Cases', () => {
//   test('success', () => {
//     request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});

//     const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         nameFirst: 'John',
//         nameLast: 'Doe',
//       },
//     });
//     const token = JSON.parse(res1.body.toString()).token;

//     const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { 
//         token: token, 
//         name: 'quiz1', 
//         description: 'A description' 
//       },
//     });
//     const quizId = JSON.parse(res2.body.toString()).quizId;

//     const res3 = request('PUT', `${url}:${port}/v1/admin/quiz/{quizId}/name`, {
//       json: { 
//         token: token, 
//         quizId: quizId, 
//         name: 'quiz2' 
//       },
//     });

//     expect(res3.statusCode).toStrictEqual(200);
//     const body3 = JSON.parse(res3.body.toString());
//     expect(body3).toStrictEqual({});
//   });
// });

// describe('Error Cases', () => {
//   beforeEach(() => {
//     request('DELETE', `${url}:${port}/v1/admin/other/clear`, {});
//   });

//   test('Token is empty or invalid', () => {
//     const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     });
//     const token = JSON.parse(authRegisterRes.body.toString()).token;
    
//     const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Original Quiz Name', description: 'A description' },
//     });
//     const quizId = JSON.parse(quizCreateRes.body.toString()).quizId;

//     const invalidToken = 'invalidToken';
//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
//       json: { token: invalidToken, name: 'New Name' },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });

//   test('Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz', () => {
//     const user1AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'user1@example.com',
//         password: 'password123',
//         firstName: 'User',
//         lastName: 'One',
//       },
//     });
//     const token1 = JSON.parse(user1AuthRes.body.toString()).token;

//     const user2AuthRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'user2@example.com',
//         password: 'password456',
//         firstName: 'User',
//         lastName: 'Two',
//       },
//     });
//     const token2 = JSON.parse(user2AuthRes.body.toString()).token;

//     const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token: token1, name: 'User1 Quiz', description: 'Description' },
//     });
//     const quizId = JSON.parse(quizCreateRes.body.toString()).quizId;

//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
//       json: { token: token2, name: 'New Name' },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });

//   test('Name contains invalid characters', () => {
//     const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     });
//     const token = JSON.parse(authRegisterRes.body.toString()).token;
    
//     const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Original Quiz Name', description: 'A description' },
//     });
//     const quizId = JSON.parse(quizCreateRes.body.toString()).quizId;

//     const invalidName = 'InvalidName@#$%^&*';
//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
//       json: { token, name: invalidName },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });

//   test('Name is less than 3 characters long', () => {
//     const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     });
//     const token = JSON.parse(authRegisterRes.body.toString()).token;
    
//     const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Original Quiz Name', description: 'A description' },
//     });
//     const quizId = JSON.parse(quizCreateRes.body.toString()).quizId;

//     const shortName = 'No';
//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
//       json: { token, name: shortName },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });

//   test('Name is longer than 30 characters', () => {
//     const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     });
//     const token = JSON.parse(authRegisterRes.body.toString()).token;
    
//     const quizCreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Original Quiz Name', description: 'A description' },
//     });
//     const quizId = JSON.parse(quizCreateRes.body.toString()).quizId;

//     const longName = 'This Quiz Name Is Definitely Way Too Long';
//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quizId}/name`, {
//       json: { token, name: longName },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });

//   test('Name is already used by the current logged in user for another quiz', () => {
//     const authRegisterRes = request('POST', `${url}:${port}/v1/admin/auth/register`, {
//       json: {
//         email: 'validemail@example.com',
//         password: 'validPassword123',
//         firstName: 'John',
//         lastName: 'Doe',
//       },
//     });
//     const token = JSON.parse(authRegisterRes.body.toString()).token;
    
//     const quiz1CreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Unique Name', description: 'Description for the first quiz' },
//     });
//     const quiz1Id = JSON.parse(quiz1CreateRes.body.toString()).quizId;

//     const quiz2CreateRes = request('POST', `${url}:${port}/v1/admin/quiz`, {
//       json: { token, name: 'Another Unique Name', description: 'Description for the second quiz' },
//     });
//     const quiz2Id = JSON.parse(quiz2CreateRes.body.toString()).quizId;

//     const updateRes = request('PUT', `${url}:${port}/v1/admin/quiz/${quiz2Id}/name`, {
//       json: { token, name: 'Unique Name' },
//     });
//     expect(JSON.parse(updateRes.body.toString()).error).toStrictEqual(expect.any(String));
//   });
// });

