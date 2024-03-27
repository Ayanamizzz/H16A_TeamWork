// Description:
// Reset the state of the application back to the start.
import { getData, setData } from "./dataStore";

/**
 * 
 * @returns {Object} empty object
 * 
 */

export function clear(): {} {
    const data = getData();
    data.users = [];
    data.quizzes = [];
    data.quizzesTrash = [];
    data.sessions = [];

    setData(data);
    return {};
}
  

// Description
// Given token as string and returns the following userId.

/*
 * @params {number} token / Id of user after registration
 * @returns {number | null} userId / Id of user after registration | null / null
 * 
*/

export function getUserId(token: string): number | null {
    const data = getData();
    const user = data.users.find(user => user.token.includes(token));
    // Return userId if token is included, otherwise return null
    if (user) {
        return user.userId
    } else {
        return null;
    }
}