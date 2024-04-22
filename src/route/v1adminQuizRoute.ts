import express, { Request, Response, Router } from 'express';
import HTTPError from 'http-errors';
import { getData } from '../dataStore';
import {
  changeThumbnail,
  getQuizSessionCSVResults,
  getQuizSessionResults,
  getSessionDetails,
  newSession, updateSessionState,
  viewSession
} from '../quiz';

const v1adminQuizRoute: Router = express.Router();

type token = {
    authUserId: number,
    sessionId: string,
}

v1adminQuizRoute.put('/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token;
  const { imgUrl } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = changeThumbnail(imgUrl, quizId, targetToken.authUserId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.json(result);
});

v1adminQuizRoute.post('/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token;
  const { autoStartNum } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = newSession(quizId, targetToken.authUserId, autoStartNum);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1adminQuizRoute.get('/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const targetToken = data.tokens.find((theToken: token) => token === theToken.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = getSessionDetails(quizId, targetToken.authUserId, sessionId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1adminQuizRoute.get('/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const targetToken = data.tokens.find((theToken: token) => token === theToken.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = getQuizSessionResults(quizId, sessionId, targetToken.authUserId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1adminQuizRoute.get('/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const targetToken = data.tokens.find((theToken: token) => token === theToken.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = getQuizSessionCSVResults(quizId, sessionId, targetToken.authUserId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1adminQuizRoute.get('/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  return res.json(viewSession(quizId));
});

v1adminQuizRoute.put('/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const quizSessionId = parseInt(req.params.sessionid);
  const token = req.headers.token;
  const { action } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  const result = updateSessionState(quizId, targetToken.authUserId, quizSessionId, action);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.json(result);
});

export default v1adminQuizRoute;
