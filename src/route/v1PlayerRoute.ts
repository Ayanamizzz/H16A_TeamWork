import express, { Request, Response, Router } from 'express';
import {
  chat,
  getChatHistory,
  getQuestionResult,
  playerJoin,
  playerQuestionInfo,
  playerResults,
  playerStatus, submitAnswer1
} from '../quiz';
import HTTPError from 'http-errors';

const v1PlayerRoute: Router = express.Router();

v1PlayerRoute.get('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = getChatHistory(playerId);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  res.status(200);
  return res.json(response);
});

v1PlayerRoute.post('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const message = req.body;
  const response = chat(playerId, message.message.messageBody);
  if ('error' in response) {
    throw HTTPError(400, response.error);
  }
  res.status(200);
  return res.json(response);
});

v1PlayerRoute.post('/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  const result = playerJoin(sessionId, name);
  // HTTP 400: Bad Request
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }

  res.status(200);
  return res.json(result);
});

v1PlayerRoute.get('/:playid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playid);
  const result = playerStatus(playerId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1PlayerRoute.get('/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const result = playerResults(playerId);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1PlayerRoute.get('/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const result = playerQuestionInfo(playerId, questionPosition);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1PlayerRoute.get('/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const result = getQuestionResult(playerId, questionPosition);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

v1PlayerRoute.put('/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const { answerIds } = req.body;
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const result = submitAnswer1(playerId, questionPosition, answerIds);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.status(200);
  return res.json(result);
});

export default v1PlayerRoute;
