import express, { Request, Response, Router } from 'express';
import HTTPError from 'http-errors';
import { getData } from '../dataStore';
import {
  adminQuizCreate,
  adminQuizCreateQuestion,
  adminQuizDescriptionUpdate,
  adminQuizEmptyTrash,
  adminQuizInfo,
  adminQuizList,
  adminQuizTrash,
  adminQuizNameUpdate,
  adminQuizQuestionDuplicate,
  adminQuizQuestionMove,
  adminQuizQuestionDelete,
  adminQuizQuestionUpdate,
  adminQuizRemove,
  adminQuizRestore,
  adminQuizTransfer,
} from '../quiz';
import { clear } from '../tests/other';

const v2adminQuizRoute: Router = express.Router();

type token = {
    authUserId: number,
    sessionId: string,
}

v2adminQuizRoute.get('/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  res.status(200).json(adminQuizTrash(targetToken.authUserId));
});

v2adminQuizRoute.post('/quiz', (req: Request, res: Response) => {
  const token = req.headers.token;
  const { name, description } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const newQuiz = adminQuizCreate(targetToken.authUserId, name, description);
  if ('error' in newQuiz) {
    throw HTTPError(400, newQuiz.error);
  }
  res.status(200);
  return res.json(newQuiz);
});

v2adminQuizRoute.get('/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  res.status(200);
  return res.json(adminQuizList(targetToken.authUserId));
});

v2adminQuizRoute.delete('/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const result = adminQuizRemove(targetToken.authUserId, quizId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.json(result);
});

v2adminQuizRoute.get('/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const quiz = adminQuizInfo(targetToken.authUserId, quizId);
  if ('error' in quiz) {
    throw HTTPError(400, quiz.error);
  }
  const quizInfo = data.quizzes.find((quizzes: typeof quiz) => quizzes.quizId === quiz.quizId);
  res.status(200);
  return res.json({
    quizId: quizInfo.quizId,
    name: quizInfo.quizName,
    timeCreated: quizInfo.timeCreated,
    timeLastEdited: quizInfo.timeLastEdited,
    description: quizInfo.description,
    numQuestions: quizInfo.questionBank.length,
    questions: quizInfo.questionBank,
    thumbnailUrl: quizInfo.thumbnailUrl
  });
});

v2adminQuizRoute.put('/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { name } = req.body;
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const result = adminQuizNameUpdate(targetToken.authUserId, quizId, name);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v2adminQuizRoute.put('/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { description } = req.body;
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const result = adminQuizDescriptionUpdate(targetToken.authUserId, quizId, description);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v2adminQuizRoute.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  return res.json(response);
});

v2adminQuizRoute.post('/quiz/:quizid/restore', (req: Request, res: Response) => {
  // 1. 401 Errors
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  // 2. 403 Errors
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  // 3. 400 Errors or Successful work on data
  const quizRestore = adminQuizRestore(targetToken.authUserId, parseInt(req.params.quizid));
  if ('error' in quizRestore) {
    throw HTTPError(400, quizRestore.error);
  }

  // No errors
  res.status(200);
  return res.json({});
});

v2adminQuizRoute.delete('/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIdsStr: string[] | undefined = req.query.quizIds as string[];
  const quizIds: number[] = quizIdsStr.map((id: string) => parseInt(id));
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  // Find user
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  // Call function
  const result = adminQuizEmptyTrash(targetToken.authUserId, quizIds);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.json({});
});

v2adminQuizRoute.post('/quiz/:quizid/transfer', (req: Request, res: Response) => {
  // 1. 401 Errors
  const { userEmail } = req.body;
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  // 2. 403 Errors
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }
  // 3. 400 Errors or Successful work on data
  const quizTransfer = adminQuizTransfer(targetToken.authUserId, parseInt(req.params.quizid), userEmail);
  if ('error' in quizTransfer) {
    throw HTTPError(400, quizTransfer.error);
  }

  // No errors
  res.status(200);
  return res.json({});
});

v2adminQuizRoute.post('/quiz/:quizid/question', (req: Request, res: Response) => {
  const token = req.headers.token;
  // 1. 401 Errors
  const { questionBody } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  // 2. 403 Errors
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  // 3. 400 Errors or Successful work on data
  const newQuestion = adminQuizCreateQuestion(targetToken.authUserId, parseInt(req.params.quizid), questionBody);
  if ('error' in newQuestion) {
    throw HTTPError(400, newQuestion.error);
  }

  // No errors
  res.status(200);
  return res.json(newQuestion);
});

v2adminQuizRoute.put('/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { questionBody } = req.body;
  const token = req.headers.token;

  // HTTP 401: Unauthorized
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);

  // HTTP 403: Forbidden
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizQuestionUpdate(targetToken.authUserId, quizId, questionId, questionBody);

  // HTTP 400: Bad Request
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }

  // HTTP 200: OK
  res.status(200);
  return res.json(result);
});

v2adminQuizRoute.delete('/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.headers.token;

  // HTTP 401: Unauthorized
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);

  // HTTP 403: Forbidden
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizQuestionDelete(targetToken.authUserId, quizId, questionId);

  // HTTP 400: Bad Request
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }

  // HTTP 200: OK
  res.status(200);
  return res.json(result);
});

v2adminQuizRoute.put('/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { newPosition } = req.body;
  const token = req.headers.token;

  // HTTP 401: Unauthorized
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);

  // HTTP 403: Forbidden
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizQuestionMove(targetToken.authUserId, quizId, questionId, newPosition);

  // HTTP 400: Bad Request
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }

  // HTTP 200: OK
  res.status(200);
  return res.json(result);
});

v2adminQuizRoute.post('/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.headers.token;

  // HTTP 401: Unauthorized
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'Token is not a valid structure');
  }

  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => sessionId === token.sessionId);

  // HTTP 403: Forbidden
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is a valid structure, but is not for a currently logged in session');
  }

  const result = adminQuizQuestionDuplicate(targetToken.authUserId, quizId, questionId);

  // HTTP 400: Bad Request
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }

  // HTTP 200: OK
  res.status(200);
  return res.json(result);
});

export default v2adminQuizRoute;
