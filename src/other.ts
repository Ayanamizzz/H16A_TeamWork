// Description:
// Reset the state of the application back to the start.
import { getData, setData } from './dataStore';
import { User } from './dataStore';
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

export function getUser(token: string): User {
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
