import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './auth'

import {
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuiztrash,
  //adminQuizRestore,
} from './quiz';
import { clear } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  if ('error' in response) {
    return res.status(400).json(response);
  }
  return res.json(response);
});

// adminAuthRegister
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in response) {
    return res.status(400).json(response);
  }
  return res.json(response);
});


// adminAuthLogin
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = adminAuthLogin(email, password);
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});


// adminAuthLogout
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.body.token;

  const response = adminAuthLogout(token);
  if ('error' in response) {
    return res.status(401).json(response);
  }
  res.json(response);
});

// adminUserDetails Request
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  // const token = parseInt(req.query.token as string, 10);
  const token = req.query.token as string;
  const response = adminUserDetails(token);

  if ('error' in response) {
    return res.status(400).json(response);
  };

  return res.json(response);
});

// adminUserDetailsUpdate
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  if ('error' in response && response.error.includes('401')) {
    return res.status(401).json(response);
  }
  if ('error' in response) {
    return res.status(400).json(response);
  }

  res.json(response);
});

// adminUserPasswordUpdate
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  if ('error' in response && response.error.includes('401')) {
    return res.status(401).json(response);
  }
  if ('error' in response) {
    return res.status(400).json(response);

  }
  res.json(response);
});


// adminQuizCreate
app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const result = adminQuizCreate(token, name, description);

  // check error.
  if ('error' in result) {
    if (result.error.includes('401')) {
      return res.status(401).json(result);
    } else {
      return res.status(400).json(result);
    }
  } 

  return res.json(result);
});


// adminQuizList
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const result = adminQuizList(token);

  // check error.
  if ('error' in result && result.error === 'Token does not refer to valid logged in user session') {
    return res.status(401).json(result);
  } 
  if ('error' in result) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

// adminQuizRemove
app.delete('/v1/admin/quiz/{quizId}', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.query.token as string;

  const result = adminQuizRemove(token, quizId);

  // check error.
  if ('error' in result && result.error === 'Token does not refer to valid logged in user session') {
    return res.status(401).json(result);
  } 
  if ('error' in result) {
    return res.status(403).json(result);
  } 

  return res.json(result);
});


// adminQuizInfo
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizid = parseInt(req.params.quizid);
  const token = req.query.token as string;

  const response = adminQuizInfo(token, quizid);

  if ('error' in response) {
    switch (response.error) {
      case 'Token is not a valid structure':
        return res.status(401).json(response);
      case 'Provided token is valid structure, but is not for a currently logged in session':
        return res.status(403).json(response);
      default:
        return res.status(400).json(response);
    }
  }

  return res.json(response);
});


// adminNameUpdate
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.body.token as string;
  const name = req.body.name as string;

  const response = adminQuizNameUpdate(token, quizId, name);

  if ('error' in response && response.error === 'Token does not refer to valid logged in user session') {
    return res.status(401).json(response);
  } else if ('error' in response && response.error.includes('name')) {
    return res.status(400).json(response);
  } else if ('error' in response && response.error.includes('quiz')) {
    return res.status(403).json(response);
  }

  return res.json(response);
});


// adminQuizDescription
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;

  const response = adminQuizDescriptionUpdate(token, quizId, description);

  if ('error' in response) {
    switch (response.error) {
      case 'Token is empty or invalid':
        return res.status(401).json({ error: response.error });
      case 'Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz':
        return res.status(403).json({ error: response.error });
      default:
        return res.status(400).json({ error: response.error });
    }
  }

  return res.json({});
});


// adminQuizTrash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminQuiztrash(token);

  if ('error' in response && response.error.includes('401')) {
    return res.status(401).json(response);
  }
  if ('error' in response && response.error.includes('403')) {
    return res.status(403).json(response);
  }
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});


// adminQuizRestore
app.post('/v1/admin/quiz/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const token = req.body.token as string;
  const response = adminQuizRestore(quizId, token);

  if ('error' in response && response.error.includes('401')) {
    return res.status(401).json(response);
  }
  if ('error' in response && response.error.includes('403')) {
    return res.status(403).json(response);
  }
  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});


// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.json({ error });
});

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});