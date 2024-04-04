import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

function handleResponse(res: Response) {
  const body = JSON.parse(res.body.toString());
  if (res.statusCode >= 400) {
    expect(body).toEqual({ error: expect.any(String) });
    return res.statusCode;
  }

  return body;
}

export function register(email: string, password: string, namefirst: string, nameLast: string): { token: string } {
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: {
      email,
      password,
      nameFirst,
      nameLast,
    },
  });

  return handleResponse(res);
}

export function quizCreate(email: string, password: string, namefirst: string, nameLast: string): { token: string } {
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    json: {
      email,
      password,
      nameFirst,
      nameLast,
    },
  });

  return handleResponse(res);
}