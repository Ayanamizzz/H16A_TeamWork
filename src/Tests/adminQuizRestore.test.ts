import request from 'sync-request-curl';
import config from '../config.json';
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

//Used to represent expected error objects
const ERROR = { error: expect.any(String) };

/**
 * @param {string} email 
 * @param {string} password 
 * @param {string} nameFirst 
 * @param {string} nameLast 
 * @returns {string} 
 */
export function NewUser_HTTP_Res(
  email: string, 
  password: string, 
  nameFirst: string, 
  nameLast: string
  ): { token: string } {
  const response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });
  return JSON.parse(response.body.toString());
}



/**
 * 
 * @param {string} token
 * @param {string} name 
 * @param {string} description 
 * @returns {string} 
 */
export function NewQuiz_HTTP_Res(
  token: string,
  name: string,
  description: string
): {quizId: number} {
  const res = request('POST', `${url}:${port}/v1/admin/quiz`, {
    json: {
      token: token,
      name: name,
      description: description,
    },
  });
  return JSON.parse(res.body.toString());
}




describe('adminQuizRestore - Success Case', () => {
  beforeEach(() => {
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });
  
  test('Status 200 - Restore Quiz Success: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin'
    );
  
    expect(user).toEqual({ token: expect.any(String) });
    // Then create a quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'Aaaaaaaaa'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const clear_response = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
      qs: { token: user.token }
    });

    expect(clear_response.statusCode).toBe(200);
    const quiz_clear_response = JSON.parse(clear_response.body.toString());
    expect(quiz_clear_response).toEqual({});
    // redo test
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz.quizId}/restore`, {
        json: { token: user.token },
      }
    );
    expect(response.statusCode).toBe(200);
    const quizTrash_response = JSON.parse(response.body.toString());
    expect(quizTrash_response).toEqual({});
    
    // cheack is trash empty?
    const viewTrashResponse = request('GET', SERVER_URL + '/v1/admin/quiz/trash', {
      qs: { token: user.token },
    });
    expect(viewTrashResponse.statusCode).toBe(200);
    const checkTrashResponseObj = JSON.parse(
      viewTrashResponse.body.toString()
    );
    expect(checkTrashResponseObj).toStrictEqual({ quizzes: [] });
    // Now check the quizzes. WIP
    // Check the trash - which should be empty - MUST BE A SERVER CALL! - WIP
    const checkquizzes_response = request('GET', SERVER_URL + '/v1/admin/quiz/list', {
        qs: { token: user.token },
      }
    );
    expect(checkquizzes_response.statusCode).toBe(200);
    const checkquizzes_responseObj = JSON.parse(
      checkquizzes_response.body.toString()
    );
    expect(checkquizzes_responseObj).toEqual({
      quizzes: [
        {
          name: expect.any(String),
          quizId: expect.any(Number)
        }
      ]
    });
  });
});


describe('Status Code :400', () => {
  beforeEach(() => {
    // Clear server status
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });
  test('Status 400 - Quiz name of the restored quiz is already used by another active quiz: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Majin4ever',
      'Ma',
      'Jin'
    );
    expect(user).toEqual({ token: expect.any(String) });
    // Create a new quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'aiowqeqeqvq'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const delResponse = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
        qs: {
          token: user.token,
        },
      }
    );
    expect(delResponse.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(delResponse.body.toString());
    expect(quizDelResponse).toEqual({});
    // make a same name quiz
    const quiz2 = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'aiowqeqeqvq'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });
    // Retrieve Quiz from trash - will report error
    const response = request('POST',SERVER_URL + `/v1/admin/quiz/${quiz.quizId}/restore`, {
        json: { token: user.token },
      }
    );
    
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });


  test('Status Code 400 - Quiz ID refers to a quiz that is not currently in the trash: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Majin4ever',
      'Ma',
      'Jin'
    );

    expect(user).toEqual({ token: expect.any(String) });
    // Then create a quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Question 1',
      'This is the description'
    );

    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const delResponse = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
        qs: { token: user.token },
      }
    );
    expect(delResponse.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(delResponse.body.toString());
    expect(quizDelResponse).toEqual({});
    // Retrieve Quiz from trash - will retuern error
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${123}/restore`, {
      json: { token: user.token },
    });
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});
describe('Status code 400', () => {
  beforeEach(() => {
    // Clear server status
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });
  test('Status 400 - Quiz name of the restored quiz is already used by another active quiz: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin'
    );
    expect(user).toEqual({ token: expect.any(String) });
    // Then create a quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'Aweweqweqwe'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const delResponse = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
        qs: { token: user.token },
      }
    );
    expect(delResponse.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(delResponse.body.toString());
    expect(quizDelResponse).toEqual({});
    // Now create another quiz with the same name
    const quiz2 = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'qworeqeiwqioeqoiewoqi'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });
    // Retrieve Quiz from trash - should throw an error
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz.quizId}/restore`, {
      json: { token: user.token },
    });
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });


  test('Status Code 400 - Quiz ID refers to a quiz that is not currently in the trash: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Majin4ever',
      'Ma',
      'Jin'
    );
    expect(user).toEqual({ token: expect.any(String) });
    // Create a new quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'oioweowqpwpep'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const delResponse = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
      qs: { token: user.token },
    });

    expect(delResponse.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(delResponse.body.toString());
    expect(quizDelResponse).toEqual({});
    // Retrieve Quiz from trash - will report an error
    const randomNumber = 99;
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${randomNumber}/restore`, {
      json: { token: user.token },
    });
    expect(response.statusCode).toBe(400);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});
describe('Status code 401', () => {
  beforeEach(() => {
    // Clear server status
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });
  test('Status 401 - Quiz name of the restored quiz is already used by another active quiz: ', () => {
    // Create a new user.
    const user = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin'
    );
    expect(user).toEqual({ token: expect.any(String) });
    // Then create a quiz
    const quiz = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'qwiewqiewqjeiqj'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Send Quiz to trash
    const delResponse = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
      qs: { token: user.token },
    });
    expect(delResponse.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(delResponse.body.toString());
    expect(quizDelResponse).toEqual({});
    // Now create another quiz with the same name
    const quiz2 = NewQuiz_HTTP_Res(
      user.token,
      'Quiz',
      'asdajeiwajeiaiwaeaiwj'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });
    // Retrieve Quiz from trash - should throw an error
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz.quizId}/restore`, {
      json: { token: 'Invalid Token' },
    });
    expect(response.statusCode).toBe(401);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});
describe('Status code 403', () => {
  beforeEach(() => {
    // Clear server status
    request('DELETE', SERVER_URL + '/v1/clear', {});
  });
  test('Status 403 - Valid token is provided, but user is not an owner of this quiz: ', () => {
    // Create users.
    const user1 = NewUser_HTTP_Res(
      'z5437798@gmail.com',
      'Wind4ever',
      'Ma',
      'Jin'
    );
    expect(user1).toEqual({ token: expect.any(String) });
    const user2 = NewUser_HTTP_Res(
      'asmasi@gmail.com',
      'love4everW',
      'Jin',
      'Ma'
    );
    expect(user2).toEqual({ token: expect.any(String) });
    const quiz = NewQuiz_HTTP_Res(
      user1.token,
      'Quiz',
      'qwirqirjqwirqij'
    );
    expect(quiz).toEqual({ quizId: expect.any(Number) });
    // Clear quiz to trash
    const clear_response = request('DELETE', `${url}:${port}/v1/admin/quiz/${quiz.quizId}`, {
      qs: { token: user1.token },
    });
    expect(clear_response.statusCode).toBe(200);
    const quizDelResponse = JSON.parse(clear_response.body.toString());
    expect(quizDelResponse).toEqual({});
    // Now create another quiz with the same name
    const quiz2 = NewQuiz_HTTP_Res(
      user1.token,
      'Question 1',
      'This is the description'
    );
    expect(quiz2).toEqual({ quizId: expect.any(Number) });
    // Retrieve Quiz from trash - should throw an error
    const response = request('POST', SERVER_URL + `/v1/admin/quiz/${quiz.quizId}/restore`, {
      json: { token: user2.token },
    });
    expect(response.statusCode).toBe(403);
    const quizTrashResponse = JSON.parse(response.body.toString());
    expect(quizTrashResponse).toEqual(ERROR);
  });
});