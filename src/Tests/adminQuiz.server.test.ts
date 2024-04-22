import { clear } from './other';

import { port, url } from './../config.json';

const SERVER_URL = `${url}:${port}`;

import {
  requestDescriptionUpdate, reqEmptyTrash,
  reqNameModify, reqNewQuiz,
  reqQuizDelete,
  reqQuizInfo,
  requestQuizList, registerReq, reqTrash, postReq, newUserCase
} from './api';

beforeEach(() => {
  clear();
});

/*
Error tests for quiz creation:
- authUserId is not a valid user
- name contains any characters that are not alphanumeric or are spaces
- name is either less than 3 characters long
- name is more than 30 characters long
- name is already used by the current logged in user for another quiz
- description is more than 100 characters in length
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('POST/v1/admin/quiz', () => {
  describe('Success Cases', () => {
    test('Create a quiz with the minimum amount of characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
      expect(newQuiz).toStrictEqual({
        quizId: expect.any(Number)
      });
    });
    test('Create quizes with unique Ids after deleted one', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', '', newToken.token);
      reqQuizDelete(newQuiz.quizId, newToken.token);
      const quiz2 = reqNewQuiz('Quiz2', '', newToken.token);
      expect(newQuiz.quizId).not.toStrictEqual(quiz2.quizId);
    });
  });
  describe('Error Cases', () => {
    test('Call with wrong token structure', () => {
      const newQuiz = reqNewQuiz('Quiz', '');
      expect(newQuiz).toStrictEqual({
        error: 'token is not a valid structure'
      });
    });
    test('Call with wrong token', () => {
      postReq(`${SERVER_URL}/v1/admin/auth/register`, newUserCase('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest'));
      const newQuiz = reqNewQuiz('Quiz1', '????', '9999');
      expect(newQuiz).toStrictEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
    test('name contains non alphanumeric characters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('?????', '', newToken.token);
      expect(newQuiz).toStrictEqual({
        error: 'name must only contain alphanumeric characters'
      });
    });
    test('name is less than 3 letters', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('a', '', newToken.token);
      expect(newQuiz).toStrictEqual({
        error: 'name must be longer than 3 characters'
      });
    });
    test('name is over 30 characters long', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('a'.repeat(31), '', newToken.token);
      expect(newQuiz).toStrictEqual({
        error: 'name cannot be longer than 30 characters'
      });
    });
    test('name is already used by the current logged in user for another quiz', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      reqNewQuiz('Quiz1', '', newToken.token);
      const newQuiz2 = reqNewQuiz('Quiz1', '', newToken.token);
      expect(newQuiz2).toStrictEqual({
        error: 'name is already by another quiz by current user'
      });
    });
    test('decription is over 100 characters long', () => {
      const newToken = registerReq('hayden@unsw.edu.au', 'Password45678', 'Hayden', 'HaydenTest');
      const newQuiz = reqNewQuiz('Quiz1', 'a'.repeat(101), newToken.token);
      expect(newQuiz).toStrictEqual({
        error: 'description cannot be longer than 100 characters'
      });
    });
  });
});

/*
Error tests for adminQuizList( authUserId ):
- Expected errors:
    - Attempt to pull quiz information from no users
    - Attempt to pull quiz information from a non-valid user with other users in data
- Success cases
    - Returns 1 quizz from one user
    - Returns a list of quizzes from just one user
    - Returns empty object when no quizzes are created by user
    - Returns correct quizzes for three different users
*/

describe('GET/v1/admin/quiz/list', () => {
  describe('Error Cases', () => {
    test('Call with wrong token structure', () => {
      const quizList = requestQuizList();
      expect(quizList).toStrictEqual({
        error: 'token is not a valid structure'
      });
    });
    test('Attempt to pull quiz information from a non-valid user with other users in data', () => {
      const quizList = requestQuizList('12345');
      expect(quizList).toStrictEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
  });
  describe('Success Cases', () => {
    test('Returns 1 quizz from one user', () => {
      const newToken = registerReq('cringemail@gmail.com', 'cringeBoy123', 'Cringe', 'Boys');
      const newQuiz = reqNewQuiz('Quiz1', '????', newToken.token);
      const quizList = requestQuizList(newToken.token);
      expect(quizList).toStrictEqual({
        quizzes: [
          {
            quizId: newQuiz.quizId,
            name: 'Quiz1'
          }
        ]
      });
    });
  });
});

describe('DELETE/v1/admin/quiz/{quizid}', () => {
  describe('Success Cases', () => {
    test('quiz is being removed ', () => {
      const newToken = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqQuizDelete(newQuiz.quizId, newToken.token);
      expect(result).toEqual({});

      const quizList = requestQuizList(newToken.token);
      expect(quizList).toStrictEqual({
        quizzes: [],
      });
    });
  });
  describe('Error Cases', () => {
    test('call token that is invalid structure', () => {
      const result = reqQuizDelete(123);
      expect(result).toEqual({
        error: 'token is not a valid structure'
      });
    });
    test('call wrong token', () => {
      const result = reqQuizDelete(123, '123');
      expect(result).toEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
    test('quizId does not refer to a valid quiz', () => {
      const newToken = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqQuizDelete(123, newToken.token);
      expect(result).toEqual({
        error: 'Quiz Id does not refer to a valid quiz'
      });
    });
    test("user don't own this quizId", () => {
      const newToken1 = registerReq('usera@email.com', 'Abc123456', 'Usera', 'Admin');
      const newToken2 = registerReq('userb@email.com', 'Abc123456', 'Userb', 'Admin');
      reqNewQuiz('quiz1', 'description', newToken1.token);
      const newQuiz2 = reqNewQuiz('quiz2', 'description', newToken2.token);
      const result = reqQuizDelete(newQuiz2.quizId, newToken1.token);
      expect(result).toEqual({
        error: 'Quiz ID does not refer to a quiz that this user owns'
      });
    });
  });
});

/*
black box test for function adminQuizDescriptionUpdateQuiz
when:
    AuthUserId is not a valid user
    Quiz ID does not refer to a valid quiz
    Quiz ID does not refer to a quiz that this user owns
    Description is more than 100 characters in length (note: empty strings are OK)
return an error specific message
*/

describe('PUT/v1/admin/quiz/{quizid}/description', () => {
  describe('Success Cases', () => {
    test('QuizDescripetionUpdated', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = requestDescriptionUpdate(newQuiz.quizId, 'new description', newToken.token);
      expect(result).toStrictEqual({});

      const quizInfo = reqQuizInfo(newQuiz.quizId, newToken.token);
      expect(quizInfo).toStrictEqual({
        quizId: newQuiz.quizId,
        name: 'quiz1',
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'new description',
        numQuestions: 0,
        questions: [],
        thumbnailUrl: ''
      });
    });
  });
  describe('Error Cases', () => {
    test('call with token with wrong structure', () => {
      const result = requestDescriptionUpdate(12345, '');
      expect(result).toStrictEqual({
        error: 'token is not a valid structure'
      });
    });
    test('call with wrong token', () => {
      const result = requestDescriptionUpdate(12345, '', '123');
      expect(result).toStrictEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
    test('return an error message when quizId is not valid', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      reqNewQuiz('quiz1', 'description', newToken.token);
      const result = requestDescriptionUpdate(12345, '', newToken.token);
      expect(result).toEqual({
        error: 'Quiz ID does not refer to a valid quiz'
      });
    });
    test('return an error message when user does not own this QuizId', () => {
      const newToken1 = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newToken2 = registerReq('user1@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken1.token);
      const result = requestDescriptionUpdate(newQuiz.quizId, '', newToken2.token);
      expect(result).toEqual({
        error: 'Quiz ID does not refer to a quiz that this user owns'
      });
    });
    test('return an error message when description is more than 100 characters in length', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = requestDescriptionUpdate(newQuiz.quizId, 'a'.repeat(101), newToken.token);
      expect(result).toEqual({ error: 'Description is more than 100 characters in length (note: empty strings are OK)' });
    });
  });
});

/*
Error tests for adminQuizInfo(authUserId, quizId):
- AuthUserId isnot a valid user
- Quiz ID does not refer to a valid quiz
- Quiz ID does not refer to a quiz that this user owns
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('GET/v1/admin/quiz/{quizid}', () => {
  describe('Success Cases', () => {
    test('All outputs are correct', () => {
      const newToken = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const newQuiz1 = reqNewQuiz('quiz1', 'description', newToken.token);
      reqNewQuiz('quiz2', 'description', newToken.token);
      const quizInfo = reqQuizInfo(newQuiz1.quizId, newToken.token);
      expect(quizInfo).toStrictEqual({
        quizId: newQuiz1.quizId,
        name: 'quiz1',
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'description',
        numQuestions: 0,
        questions: [],
        thumbnailUrl: ''
      });
    });
  });
  describe('Error Cases', () => {
    test('Call token with wrong structure', () => {
      const quizInfo = reqQuizInfo(12345);
      expect(quizInfo).toStrictEqual({
        error: 'token is not a valid structure'
      });
    });
    test('Call wrong token', () => {
      const quizInfo = reqQuizInfo(12345, '12345');
      expect(quizInfo).toStrictEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
    test('QuizId does not refer to a valid quiz', () => {
      const newToken = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const quizInfo = reqQuizInfo(12345, newToken.token);
      expect(quizInfo).toStrictEqual({
        error: 'Quiz ID does not refer to a valid quiz'
      });
    });
    test('QuizId does not refer to a quiz that this user owns', () => {
      const newToken1 = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const newToken2 = registerReq('user1@gmail.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken1.token);
      const quizInfo = reqQuizInfo(newQuiz.quizId, newToken2.token);
      expect(quizInfo).toStrictEqual({
        error: 'Quiz ID does not refer to a quiz this user owns'
      });
    });
  });
});

/*
Error tests for adminQuizNameUpdate(authUserId, quizID, name):
- authUserId is not a valid user
- quizId does not refer to a valid quiz
- quizId does not refer to a quiz that this user owns
- name contains any characters that are not alphanumeric or are spaces
- name is less than 3 characters long
- name is longer than 30 characters long
- name is already used by the current logged in user for another quiz
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('PUT/v1/admin/quiz/{quizid}/name', () => {
  describe('Success Cases', () => {
    test('name is 3 characters long', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(newQuiz.quizId, 'a'.repeat(3), newToken.token);
      expect(result).toStrictEqual({});

      const quizInfo = reqQuizInfo(newQuiz.quizId, newToken.token);
      expect(quizInfo).toStrictEqual({
        quizId: newQuiz.quizId,
        name: 'aaa',
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'description',
        numQuestions: 0,
        questions: [],
        thumbnailUrl: ''
      });
    });
    test('name is 30 characters', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(newQuiz.quizId, 'a'.repeat(30), newToken.token);
      expect(result).toStrictEqual({});

      const quizInfo = reqQuizInfo(newQuiz.quizId, newToken.token);
      expect(quizInfo).toStrictEqual({
        quizId: newQuiz.quizId,
        name: 'a'.repeat(30),
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'description',
        numQuestions: 0,
        questions: [],
        thumbnailUrl: ''
      });
    });
    test('change name when there are multiple quizzes', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz1 = reqNewQuiz('quiz1', 'description', newToken.token);
      reqNewQuiz('quiz2', 'description', newToken.token);
      reqNewQuiz('quiz3', 'description', newToken.token);
      const result = reqNameModify(newQuiz1.quizId, 'a'.repeat(30), newToken.token);
      expect(result).toStrictEqual({});

      const quizInfo = reqQuizInfo(newQuiz1.quizId, newToken.token);
      expect(quizInfo).toStrictEqual({
        quizId: newQuiz1.quizId,
        name: 'a'.repeat(30),
        timeCreated: expect.any(String),
        timeLastEdited: expect.any(String),
        description: 'description',
        numQuestions: 0,
        questions: [],
        thumbnailUrl: ''
      });
    });
  });
  describe('Error Cases', () => {
    test('Call with wrong token structure', () => {
      const result = reqNameModify(1234, 'a'.repeat(30));
      expect(result).toStrictEqual({
        error: 'token is not a valid structure'
      });
    });
    test('Call with wrong token', () => {
      const result = reqNameModify(1234, 'a'.repeat(30), '1234');
      expect(result).toStrictEqual({
        error: 'token is valid, but is not for a currently logged in session'
      });
    });
    test('quizId does not refer to a valid quiz', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(12345, 'a'.repeat(30), newToken.token);
      expect(result).toStrictEqual({
        error: 'quizId does not refer to a valid quiz'
      });
    });
    test('quizId does not refer to a quiz that this user owns', () => {
      const newToken1 = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newToken2 = registerReq('user1@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken1.token);
      const result = reqNameModify(newQuiz.quizId, 'a'.repeat(30), newToken2.token);
      expect(result).toStrictEqual({
        error: 'quizId does not refer to a quiz that this user owns'
      });
    });
    test('name contains characters that are not alphanumeric or spaces', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(newQuiz.quizId, '????????', newToken.token);
      expect(result).toStrictEqual({
        error: 'name must not contain characters that are not alphanumeric or spaces'
      });
    });
    test('name is less than 3 characters long', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(newQuiz.quizId, 'a', newToken.token);
      expect(result).toStrictEqual({
        error: 'name must be longer than 3 characters'
      });
    });
    test('name is longer than 30 characters long', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      const result = reqNameModify(newQuiz.quizId, 'a'.repeat(31), newToken.token);
      expect(result).toStrictEqual({
        error: 'name must be less than 30 characters'
      });
    });
    // test('name is an empty string', () => {
    //   const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
    //   const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
    //   const result = reqNameModify(newQuiz.quizId, '', newToken.token);
    //   expect(result).toStrictEqual({
    //     error: 'name must be longer than 3 characters'
    //   });
    // });
    test('name is already used by current logged in user for another quiz', () => {
      const newToken = registerReq('user@email.com', 'Abc123456', 'User', 'Admin');
      reqNewQuiz('quiz1', 'description', newToken.token);
      const newQuiz2 = reqNewQuiz('quiz2', 'description', newToken.token);
      const result = reqNameModify(newQuiz2.quizId, 'quiz1', newToken.token);
      expect(result).toStrictEqual({
        error: 'name is already used by current logged in user for another quiz'
      });
    });
  });
});

/*
Tests for /v1/admin/quiz/trash/empty
Error Cases:
  - One or more of the Quiz Ids is not a valid quiz
  - One or more of the Quiz Ids refers to a quiz that this current user does not own
  - One or more of the Quiz Ids is not currently in the trash
  - Token is not a value structure
  - Provided token is a valid structure, but is not for a currently logged in session

Success Cases:
  - Correct Return Object
  - Unable to restore quizzes from trash after empty

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/

describe('DELETE/v1/admin/quiz/trash/empty', () => {
  describe('Error cases', () => {
    test('Not valid quiz', () => {
      const testObjects = setupObjectsTrashEmpty();
      const response = reqEmptyTrash([12345], testObjects.user2Token.token);
      expect(response).toStrictEqual({ error: 'One or more of the Quiz Ids is not a valid quiz' });
    });

    test('Quiz not owned by user', () => {
      const testObjects = setupObjectsTrashEmpty();
      const response = reqEmptyTrash([testObjects.user2Quiz2.quizId, testObjects.user1Quiz1.quizId], testObjects.user2Token.token);
      expect(response).toStrictEqual({ error: 'One or more of the Quiz Ids refers to a quiz that this current user does not own' });
    });

    test('One or more quizzes not currently in trash', () => {
      const testObjects = setupObjectsTrashEmpty();
      const response = reqEmptyTrash([testObjects.user2Quiz2.quizId, testObjects.user2Quiz1.quizId], testObjects.user2Token.token);
      expect(response).toStrictEqual({ error: 'One or more of the Quiz Ids is not currently in the trash' });
    });

    test('Token is not a value structure', () => {
      const response = reqEmptyTrash([12345]);
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const response = reqEmptyTrash([12345], '12345');
      expect(response).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
  });

  describe('Success cases', () => {
    test('correct return object', () => {
      const testObjects = setupObjectsTrashEmpty();
      const response = reqEmptyTrash([testObjects.user2Quiz2.quizId], testObjects.user2Token.token);
      expect(response).toStrictEqual({});
    });

    // test('Unable to restore deleted quiz', () => {
    //   const testObjects = setupObjectsTrashEmpty();
    //   reqEmptyTrash([testObjects.user2Quiz2.quizId], testObjects.user2Token.token);
    //   const response = reqRestoreQuiz(testObjects.user2Quiz2.quizId, testObjects.user2Token.token);
    //   expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    // });
  });
});

/**
 * Purpose of this function is to setup some useable objects for trash/empty testing
 *
 * @returns Objects to use in testing
 */

const setupObjectsTrashEmpty = () => {
  const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
  const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);
  const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
  const user2Quiz1 = reqNewQuiz('quiz2', 'description', user2Token.token);
  const user2Quiz2 = reqNewQuiz('quiz3', 'description', user2Token.token);
  reqQuizDelete(user1Quiz1.quizId, user1Token.token);
  reqQuizDelete(user2Quiz2.quizId, user2Token.token);

  // Note we arent moving user2Quiz1 to trash
  return {
    user1Token: user1Token,
    user2Token: user2Token,
    user1Quiz1: user1Quiz1,
    user2Quiz1: user2Quiz1,
    user2Quiz2: user2Quiz2
  };
};

describe('GET/v1/admin/quiz/trash', () => {
  describe('Success Cases', () => {
    test('Get all quizzes in trash', () => {
      const newToken = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
      const newQuiz = reqNewQuiz('quiz1', 'description', newToken.token);
      reqQuizDelete(newQuiz.quizId, newToken.token);
      const trash = reqTrash(newToken.token);
      expect(trash).toStrictEqual({
        quizzes: [{
          quizId: newQuiz.quizId,
          name: 'quiz1'
        }],
      });
    });
  });
  describe('error Cases', () => {
    test('Token is not a valid structure', () => {
      const trash = reqTrash();
      expect(trash).toStrictEqual({ error: 'token is not a valid structure' });
    });
    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const trash = reqTrash('12345');
      expect(trash).toStrictEqual({ error: 'token is valid, but is not for a currently logged in session' });
    });
  });
});

afterAll(() => {
  clear();
});
