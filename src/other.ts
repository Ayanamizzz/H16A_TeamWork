// Description:
// Reset the state of the application back to the start.
import { getData, setData, QuizState } from './dataStore';
import { User, Quiz, Session } from './dataStore';
import { nanoid, customAlphabet } from 'nanoid';
/**
 *
 * @returns {Object} empty object
 *
 */

export function clear():unknown {
  const data = getData();
  data.users = [];
  data.quizzes = [];
  data.quizzesTrash = [];
  data.sessions = [];

  setData(data);
  return {};
}

/**
 *
 * @param {string} token
 * @returns {User | null}
 */

export function getUser(token: string): User | null {
  if (!token) {
    return null;
  }
  const data = getData();
  for (const user of data.users) {
    for (const item of user.token) {
      if (token === item) {
        return user;
      }
    }
  }
  return null;
}

/**
 *
 * @param {number} quizId 
 * @returns {Quiz | null}
 */
export function getQuiz(quizId: number): Quiz | null {
  const data = getData();
  for (const currentQuiz of data.quizzes) {
    if (currentQuiz.quizId === quizId) {
      return currentQuiz;
    }
  }
  return null;
}

/**
 * Gets a quizSession from a sessionId
 *
 */
export function getQuizSession(sessionId: number) {
  const data = getData();
  for (const quiz of data.quizzes) {
    for (const session of quiz.sessions) {
      if (session.sessionId === sessionId) {
        return session;
      }
    }
  }
}

/**
 *
 * @returns {number} sessionId - The sessionId that has been generated
 */
export function CreateaSessionId(): number {
  let sessionId;
  do {
    const nanoid = customAlphabet('1234567890', 10);
    sessionId = parseInt(nanoid());
  } while (!isUniqueSessionId(sessionId));

  return sessionId;
}

/**
 * Checks to see whether a sessionId is unique throughout the dataStore.
 *
 * @param {number} sessionId - The sessionId to check
 * @returns {bool} - Returns true if unique, else returns false
 */
function isUniqueSessionId(sessionId: number): boolean {
  const data = getData();

  for (const quiz of data.quizzes) {
    for (const session of quiz.sessions) {
      if (session.sessionId === sessionId) {
        return false;
      }
    }
  }

  for (const quiz of data.quizzesTrash) {
    for (const session of quiz.sessions) {
      if (session.sessionId === sessionId) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Updates the Quiz session state, as long as it is valid.
 * @param {QuizState} action - the action/session state that will update the current state.
 * @param {QuizSession} session - The Quiz session.
 * @returns { QuizState | null }  - Returns empty object if successfully updated. Otherwise return a null.
 */
export function getQuizState(action: string) {
  switch (action) {
    case 'LOBBY':
      return QuizState.LOBBY;
    case 'ANSWER_SHOW':
      return QuizState.ANSWER_SHOW;
    case 'QUESTION_OPEN':
      return QuizState.QUESTION_OPEN;
    case 'QUESTION_CLOSE':
      return QuizState.QUESTION_CLOSE;
    case 'QUESTION_COUNTDOWN':
      return QuizState.QUESTION_COUNTDOWN;
    case 'FINAL_RESULTS':
      return QuizState.FINAL_RESULTS;
    case 'END':
      return QuizState.END;
    default:
      return null;
  }
}

/**
 * Updates the Quiz session state, as long as it is valid.
 * @param {QuizState} action - the action/session state that will update the current state.
 * @param {QuizSession} session - The Quiz session.
 * @returns { {} | null }  - Returns empty object if successfully updated. Otherwise return a null.
 */
export function updateSessionState(action: QuizState, session: Session) {

  // Action enum cannot be applied in the current state (see spec for details)
  if (session.state === QuizState.LOBBY) {
    if (action === QuizState.END || action === QuizState.QUESTION_COUNTDOWN) {
      session.state = action;
      return {};
    }
  } else if (session.state === QuizState.QUESTION_COUNTDOWN) {
    if (action === QuizState.QUESTION_OPEN || action === QuizState.END) {
      session.state = action;
      return {};
    }
  } else if (session.state === QuizState.QUESTION_OPEN) {
    if (
      action === QuizState.QUESTION_CLOSE ||
      action === QuizState.ANSWER_SHOW ||
      action === QuizState.END
    ) {
      session.state = action;
      return {};
    }
  } else if (session.state === QuizState.QUESTION_CLOSE) {
    if (
      action === QuizState.QUESTION_COUNTDOWN ||
      action === QuizState.FINAL_RESULTS ||
      action === QuizState.ANSWER_SHOW ||
      action === QuizState.END
    ) {
      session.state = action;
      return {};
    }
  } else if (session.state === QuizState.ANSWER_SHOW) {
    if (
      action === QuizState.QUESTION_COUNTDOWN ||
      action === QuizState.FINAL_RESULTS ||
      action === QuizState.END
    ) {
      session.state = action;
      return {};
    }
  } else if (session.state === QuizState.FINAL_RESULTS) {
    if (
      action === QuizState.END
    ) {
      session.state = action;
      return {};
    }
  }
  return null;
}
