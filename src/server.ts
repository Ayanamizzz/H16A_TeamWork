import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import {
  adminAuthRegister,
  adminAuthLogin,
  adminAuthLogout,
  adminUserDetails,
  adminUserDetailUpdate,
  adminUserPasswordUpdate,
} from './auth';

import { clear } from './tests/other';

import v1adminQuizRoute from './route/v1adminQuizRoute';
import v1PlayerRoute from './route/v1PlayerRoute';
import v2adminQuizRoute from './route/v2AdminQuizRoute';
import interceptorMiddleware from './interceptor/interceptorMiddleware';

import { createClient } from '@vercel/kv';

// Replace this with your API_URL
// E.g. https://large-poodle-44208.kv.vercel-storage.com
const KV_REST_API_URL="https://choice-husky-44782.upstash.io";
// Replace this with your API_TOKEN
// E.g. AaywASQgOWE4MTVkN2UtODZh...
const KV_REST_API_TOKEN="Aa7uASQgOWU5MTM1NTgtZDE3Ni00NjdkLWFhNTEtNTdjOTMwMDk3ZTI5ZDAxZjEyNjEzOTBiNDVjZGIzOWIxNjFlYmE3YzlkMTU=";

const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});


// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

app.use(interceptorMiddleware);

app.use('/v1/admin', v1adminQuizRoute);
app.use('/v1/player', v1PlayerRoute);
app.use('/v2/admin', v2adminQuizRoute);

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

type token = {
  authUserId: number,
  sessionId: string,
}

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// clear(DELETE)
app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  return res.json(response);
});

// adminAuthRegister(POST)
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const newAuthId = adminAuthRegister(email, password, nameFirst, nameLast);
  if ('error' in newAuthId) {
    res.status(400);
    return res.json(newAuthId);
  }
  res.json({ token: newSessionToken(newAuthId.authUserId) });
});

// adminAuthLogin(POST)
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const authId = adminAuthLogin(email, password);
  if ('error' in authId) {
    res.status(400);
    return res.json(authId);
  }
  res.status(200);
  return res.json({ token: newSessionToken(authId.authUserId) });
});

// adminAuthLogout(POST)
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is for a user who has already logged out');
  }
  res.status(200).json(adminAuthLogout(targetToken.authUserId));
});

// adminUserDetails
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const sessionId = req.headers.token;
  if (!('token' in req.headers) || typeof sessionId !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const token = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (token === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  res.status(200);
  return res.json(adminUserDetails(token.authUserId));
});

// adminUserDetailUpdate(PUT)
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token;
  const { email, nameFirst, nameLast } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'token is valid, but is not for a currently logged in session');
  }
  const result = adminUserDetailUpdate(targetToken.authUserId, email, nameFirst, nameLast);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  return res.json(result);
});

// adminUserPasswordUpdate(PUT)
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const token = req.headers.token;
  const { oldPassword, newPassword } = req.body;
  if (!('token' in req.headers) || typeof token !== 'string') {
    throw HTTPError(401, 'token is not a valid structure');
  }
  const data = getData();
  const sessionId = token;
  const targetToken = data.tokens.find((token: token) => token.sessionId === sessionId);
  if (targetToken === undefined) {
    throw HTTPError(403, 'Provided token is valid structure, but is not for a currently logged in session');
  }
  const result = adminUserPasswordUpdate(targetToken.authUserId, oldPassword, newPassword);
  if ('error' in result) {
    throw HTTPError(400, result.error);
  }
  res.json(result);
});

// Save images in ./images and able to be accessed in /images route
app.use('/images', express.static('./images'));

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

/**
 * Provides a new token for a user
 * @param authUserId Id of admin User
 * @returns new token Id
 */
const newSessionToken = (authUserId: number): string => {
  const data = getData();
  const tokens = data.tokens;
  const sessionId = getSessionId().toString();
  tokens.push({ authUserId: authUserId, sessionId: sessionId });
  setData(data);
  return sessionId;
};

/**
 *
 * @returns The next avaliable token
 */
const getSessionId = (): number => {
  const dataStore = getData();
  const tokens = dataStore.tokens;
  let newId = 0;
  while (tokens.some((token: token) => parseInt(token.sessionId) === newId)) {
    newId++;
  }
  return newId;
};
