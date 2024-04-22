import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

import request from 'sync-request-curl';
// import request from 'sync-request';

export const stringToObjection = (res: any) => JSON.parse(res.body.toString());

export const getReq = (url: string, data?: any, header?: any) => {
  const res = request('GET', url, { qs: data, headers: header });
  return stringToObjection(res);
};

export const deleteReq = (url: string, data?: any, header?: any) => {
  const res = request('DELETE', url, { qs: data, headers: header });
  return stringToObjection(res);
};

export const postReq = (url: string, data?: any, header?: any) => {
  const res = request('POST', url, { json: data, headers: header });
  return stringToObjection(res);
};

export const putRequest = (url: string, data?: any, header?: any) => {
  const res = request('PUT', url, { json: data, headers: header });
  return stringToObjection(res);
};

export const newUserCase = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast };
};

export const newLoginCase = (email: string, password: string) => {
  return { email: email, password: password };
};

export const updateDetails = (email: string, nameFirst: string, nameLast: string) => {
  return { email: email, nameFirst: nameFirst, nameLast: nameLast };
};

export const detailsReq = (tokens?: any) => {
  return getReq(`${SERVER_URL}/v2/admin/user/details`, {}, { token: tokens });
};

export const logoutReq = (tokens?: any) => {
  return postReq(`${SERVER_URL}/v2/admin/auth/logout`, {}, { token: tokens });
};

export const registerReq = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return postReq(`${SERVER_URL}/v1/admin/auth/register`, newUserCase(email, password, nameFirst, nameLast));
};

export const loginReq = (email: string, password: string) => {
  return postReq(`${SERVER_URL}/v1/admin/auth/login`, newLoginCase(email, password));
};

export const passwordUpdateReq = (passwordOld: string, passwordNew: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/user/password`, {
    oldPassword: passwordOld,
    newPassword: passwordNew
  }, { token: tokens });
};

export const updateDetailsReq = (email: string, nameFirst: string, nameLast: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/user/details`, updateDetails(email, nameFirst, nameLast), { token: tokens });
};

export const createNewQuiz = (name: string, description: string) => {
  return { name: name, description: description };
};

export const reqNewQuiz = (name: string, description: string, tokens?: string) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz`, createNewQuiz(name, description), { token: tokens });
};

export const reqNewSession = (quizId: number, autoStartN: number, tokens?: any) => {
  return postReq(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/start`, { autoStartNum: autoStartN }, { token: tokens });
};

export const reqNewQuestion = (quizId: number, data: any, tokens?: any) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz/${quizId}/question`, data, { token: tokens });
};

export const sendChat = (playerId: number, chat: string) => {
  return postReq(`${SERVER_URL}/v1/player/${playerId}/chat`, { message: { messageBody: chat } });
};

export const getChat = (playerId: number) => {
  return getReq(`${SERVER_URL}/v1/player/${playerId}/chat`, {});
};

export const nameModify = (name: string) => {
  return { name: name };
};

export const descriptionModify = (description: string) => {
  return { description: description };
};

export const requestQuizList = (token?: any) => {
  return getReq(`${SERVER_URL}/v2/admin/quiz/list`, {}, { token: token });
};

export const reqQuizDelete = (quizId: number, tokens?: any) => {
  return deleteReq(`${SERVER_URL}/v2/admin/quiz/${quizId}`, {}, { token: tokens });
};

export const requestDescriptionUpdate = (quizId: number, description: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/quiz/${quizId}/description`, descriptionModify(description), { token: tokens });
};

export const reqQuizInfo = (quizId: number, tokens?: any) => {
  return getReq(`${SERVER_URL}/v2/admin/quiz/${quizId}`, {}, { token: tokens });
};

export const reqNameModify = (quizId: number, name: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/quiz/${quizId}/name`, nameModify(name), { token: tokens });
};

export const reqEmptyTrash = (quizIds: number[], tokens?: any) => {
  return deleteReq(`${SERVER_URL}/v2/admin/quiz/trash/empty`, { quizIds: quizIds }, { token: tokens });
};

export const reqTrash = (tokens?: any) => {
  return getReq(`${SERVER_URL}/v2/admin/quiz/trash`, {}, { token: tokens });
};

export const reqModifyQuizThumbnail = (quizId: number, url: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v1/admin/quiz/${quizId}/thumbnail`, { imgUrl: url }, { token: tokens });
};

// DeleteQuestion
export const reqDeleteQuestion = (quizId: number, questionId: number, tokens?: any) => {
  return deleteReq(`${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token: tokens });
};

// SessionDetails
export const reqGetSessionStatus = (quizId: number, sessionId: string, token?: any) => {
  return getReq(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}`, {}, { token: token });
};

// other
export const reqSessionStateUpdate = (quizId: number, sessionId: number, actions: string, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}`, { action: actions }, { token: tokens });
};

// playerJoin
export const reqPlayerJoin = (sessionId: number, name: string) => {
  return postReq(`${SERVER_URL}/v1/player/join`, { sessionId: sessionId, name: name });
};

// QuestionInfo
export const putRequestForOriginRes = (url: string, data: any, header?: any) => {
  const res = request('PUT', url, { json: data, headers: header });
  return res;
};

export const reqPlayerQuestionInfo = (playerId: number, questionPosition: number) => {
  return getReq(`${SERVER_URL}/v1/player/${playerId}/question/${questionPosition}`, {});
};

export const reqSessionStateUpdateForOriginRes = (quizId: number, sessionId: number, actions: string, tokens?: any) => {
  return putRequestForOriginRes(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}`, { action: actions }, { token: tokens });
};

// playerResult
export const reqPlayerResults = (playerId: number) => {
  return getReq(`${SERVER_URL}/v1/player/${playerId}/results`, {});
};

// playerStatus
export const reqPlayerStatus = (playerId: number) => {
  return getReq(`${SERVER_URL}/v1/player/${playerId}`, {});
};

// questionDuplicate
export const reqDuplicateQuestion = (quizId: number, questionId: number, tokens?: any) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token: tokens });
};

// Move
export const reqMoveQuestion = (quizId: number, questionId: number, position: number, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition: position }, { token: tokens });
};

// result
export const reqQuestionResults = (playerId: number, questionPosition: number) => {
  return getReq(`${SERVER_URL}/v1/player/${playerId}/question/${questionPosition}/results`, {});
};

// questionUpdate
export const requestquizNew = (name: string, description: string, tokens?: string) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz`, createNewQuiz(name, description), { token: tokens });
};

export const reqQuestionUpdate = (quizId: number, questionId: number, data: any, tokens?: any) => {
  return putRequest(`${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}`, data, { token: tokens });
};

export const quizNewWithQuestion = () => {
  const user1Token = registerReq('z5437798@gmail.com', 'Wind4ever', 'Ma', 'Jin');
  const user1Quiz1 = requestquizNew('quiz1', 'description', user1Token.token);
  const quiz1Question1 = reqNewQuestion(
    user1Quiz1.quizId,
    {
      questionBody: {
        question: 'Who i am',
        duration: 4,
        points: 4,
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
        answers: [
          {
            answer: 'Take some deep breaths',
            correct: true
          },
          {
            answer: 'Who knows',
            correct: false
          },
          {
            answer: 'Cry more',
            correct: false
          },
          {
            answer: 'lmao',
            correct: false
          }
        ]
      }
    },
    user1Token.token
  );
  reqNewQuestion(
    user1Quiz1.quizId,
    {
      questionBody: {
        question: 'Another question?',
        duration: 4,
        points: 4,
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
        answers: [
          {
            answer: 'Take some deep breaths',
            correct: true
          },
          {
            answer: 'Who knows',
            correct: false
          },
          {
            answer: 'Cry more',
            correct: false
          },
          {
            answer: 'lmao',
            correct: false
          }
        ]
      }
    },
    user1Token.token
  );
  return {
    token: user1Token.token,
    quizId: user1Quiz1.quizId,
    questionId: quiz1Question1.questionId
  };
};

// Restore
export const reqRestoreQuiz = (quizId: number, tokens?: any) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz/${quizId}/restore`, {}, { token: tokens });
};

// CSVResults
export const reqGetSessionCSVResults = (quizId: number, sessionId: number, token?: string) => {
  return getReq(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}/results/csv`, {}, { token: token });
};

// SessionResults
export const reqGetSessionResults = (quizId: number, sessionId: number, token?: string) => {
  return getReq(`${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}/results`, {}, { token: token });
};

// Transfer
export const reqQuizTransfer = (quizId: number, email: string, tokens?: any) => {
  return postReq(`${SERVER_URL}/v2/admin/quiz/${quizId}/transfer`, { userEmail: email }, { token: tokens });
};

// StartSession
export const newQuizWithQuestion = () => {
  const newToken = registerReq('z5437798@gmail.com', 'Wind4ever', 'Ma', 'Jin');
  const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
  reqNewQuestion(
    newQuiz.quizId,
    {
      questionBody: {
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
        question: 'Why am i crying',
        duration: 4,
        points: 4,
        answers: [
          {
            answer: 'Take some deep breaths',
            correct: true
          },
          {
            answer: 'Who knows',
            correct: false
          },
          {
            answer: 'Cry more',
            correct: false
          },
          {
            answer: 'lmao',
            correct: false
          }
        ]
      }
    },
    newToken.token
  );
  return { token: newToken.token, quizId: newQuiz.quizId };
};

// SubmitAnswer
export const requestSubmitAnswer = (playerid: number, questionposition: number, answerId: number[]) => {
  return putRequest(`${SERVER_URL}/v1/player/${playerid}/question/${questionposition}/answer`, { answerIds: answerId });
};

// SessionList
export const reqSessionList = (quizId: number, tokens?: any) => {
  return getReq(`${SERVER_URL}/v1/admin/quiz/${quizId}/sessions`, {}, { token: tokens });
};
