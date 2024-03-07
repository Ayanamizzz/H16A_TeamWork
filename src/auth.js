// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//get data from dataStore.js
import { getData, setData } from './dataStore.js';

//从npmjs.com/package/validator调用isEmail
import isEmail from 'validator/lib/isEmail';

/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {quizId} Id of quiz
 * 
 * 
*/


// Description:
// Given a registered user's email and password returns their authUserId value.



function adminAuthLogin(email, password) {
    //Access data Extract data from the database
    let data = getData();
    //Determine whether the mailbox is duplicated
    for (let i = 0; i < data.users.length; i++) {
        //decide emaill = emial in dataStore
        if (data.users[i].email === email) {
            if (data.users[i].password === password) {
                return {
                    authUserId: data.users[i].authUserId
                }
            } else {
                return { 
                    error: 'Password is not correct for the given email.' 
                };
            }
        }
    }
    // Error address does not exist
    setData(data);
    return {
        error: 'Email address does not exist.'
    }
}

export { adminAuthLogin };



