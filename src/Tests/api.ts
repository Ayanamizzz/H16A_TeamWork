import request from 'sync-request-curl';
import config from '../config.json';
import { Quiz, User, getData } from '../dataStore';
const port = config.port;
const url = config.url;

// function handleResponse(res: Response) {
//   const body = JSON.parse(res.body.toString());
//   if (res.statusCode >= 400) {
//     expect(body).toEqual({ error: expect.any(String) });
//     return res.statusCode;
//   }

//   return body;
// }

/**
 * Creates a user with a token in HTTP
 * @param {string} email - The email
 * @param {string} password - The password
 * @param {string} nameFirst - The first name of the user.
 * @param {string} nameLast - The last name of the user.
 * @returns {string} - Returns an Object that belongs to the user.
 */

export function register(email: string, password: string, nameFirst: string, nameLast: string): { token: string } {
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: {
      email: email,
      password: password,
      nameFirst: nameFirst,
      nameLast: nameLast,
    },
  });

  return JSON.parse(res.body.toString());
}



export function quizCreate(
  token: string,
  name: string,
  description: string
) {
  const response = request('POST', `${url}:${port}/v1/admin/quiz`, {
    json: {
      token: token,
      name: name,
      description: description,
    },
  });
  return JSON.parse(response.body.toString());
}


/**
 * delete quiz in http call
 * @param {number} quizId - QuizId Number.
 * @returns {} - Returns empty object.
 */

export function deleteQuiz(token: string, quizId: number):{} {
  const response = request('DELETE', `${url}:${port}/v1/admin/quiz/${quizId}`, {
    qs: {
      token: token,
    },
  });
  return JSON.parse(response.body.toString());
}


export function QuizList(token: string) {
  const quizzesRaw = request('GET', `${url}:${port}/v1/admin/quiz/list`, {
    qs: {
      token: token,
    },
  });
  return JSON.parse(quizzesRaw.body.toString());
}

export function QuizzesFromTrash(token: string): Quiz[] {
  const response = request('GET', `${url}:${port}/v1/admin/quiz/trash`, {
    qs: {
      token: token,
    },
  });
  return JSON.parse(response.body.toString());
}