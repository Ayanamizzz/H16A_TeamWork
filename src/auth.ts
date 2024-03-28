// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//Extract function from dataStore.js to obtain data
//from npmjs.com/package/validator to obtain isEmail
import isEmail from 'validator/lib/isEmail';
import { getData, setData } from './dataStore.js';
import { nanoid } from 'nanoid';
import { getUser, getUserId } from './other'

interface userInDetail {
    userId: number;
    name: string;
    email: string;
    numSuccessfulLogins: number;
    numFailedPasswordsSinceLastLogin: number;
}


/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {{token: string}} Id of users
 * 
 * 
*/
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { token: string } | {error: string} {
    //getdata to data. and i will use data to do the next step
    const data = getData();

    //Query all user's email whether it is query email
    for (const user of data.users) {
        if (user.email === email) {
            return {
                error: 'Email address is used by another user.'
            }
        }
    }
    //Call the isEmail function of the website to determine whether it is an email address
    if (!isEmail(email)) {
        return {
            error: 'Email does not satisfy',
        }
    };
    //Name must be at least two characters long， Maximum 20 characters
    const isValidName = (name: string) => /^[\p{L} \-']{2,20}$/u.test(name);

    if (!isValidName(nameFirst)) {
        return {
            error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
        }
    }
    if (!isValidName(nameLast)) {
        return {
            error: 'nameLast is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
        }
    }

    //Name must be at least two characters long， Maximum 20 characters
    // Description:
    // Given a registered user's email and password returns their authUserId value.
    
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        return {
            error: 'Password is less than 8 characters or does not contain at least one number and at least one letter.',
        };
    }
    
    let userId = 0;
    const length = data.users.length;
    if (length === 0) {
        userId = 0;
    } else {
        userId = length;
    }

    const isnotSameToken = (token: string): boolean => {
        for (const user of data.users) {
            for (const item of user.token) {
                if (item === token) {
                    return false;
                }
            }
        }
        return true;
    }
    
    let token: string;
    do {
        token = nanoid(10);
    } while (!isnotSameToken(token));

    //push users'data to dataStore(and setData to data)
    const oldPasswordSting: string[] = [];
    data.users.push({
        userId: userId,
        nameFirst: nameFirst,
        nameLast: nameLast, 
        email: email,
        password: password,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
        oldPasswords: oldPasswordSting,
        token: [token],
    })
    
    //Use set to store current user IDs
    
    setData(data);
    return { token: token};
}




/*
 * @params {string} email
 * @params {string} password
 * @returns {authuserId} Id of user
 * 
 * 
*/


// Description:
// Given a registered user's email and password returns their authUserId value.



export function adminAuthLogin(email: string, password: string): { token: string } | { error: string} {
    //Access data Extract data from the database
    let data = getData();
    //Determine whether the mailbox is duplicated

    for (const user of data.users) {
        if (user.email === email) {
            if (user.password === password) {
                user.numFailedPasswordsSinceLastLogin = 0;
                user.numSuccessfulLogins++;
                setData(data);

                const isnotSameToken = (token: string): boolean => {
                    for (const user of data.users) {
                        for (const item of user.token) {
                            if (item === token) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                let token: string;
                do {
                    token = nanoid(10);
                } while (!isnotSameToken(token));
                return {
                    token: token,
                }
            } else {
                user.numFailedPasswordsSinceLastLogin++;
                setData(data);
                return {
                    error: 'Password is not correct for the given email.'
                }
            }
        }
    }
    
    // Error address does not exist
    setData(data);
    return {
        error: 'Email address does not exist.'
    }

}



/**
 * 
 * @param {string} token 
 * @returns {user}
 */
export function adminUserDetails(token: string): { user: userInDetail } | { error: string } {
    const user = getUser(token);

    if (!user) {
        return {
            error: 'AuthUserId is not a valid user'
        }
    }

    return {
        user:
        {
            userId: user.userId,
            name: user.nameFirst + ' ' + user.nameLast,
            email: user.email,
            numSuccessfulLogins: user.numSuccessfulLogins,
            numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
        }
    };

}



export function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): object | {error: string} {
    // Get dataStore
    const data = getData();
  
    // AuthUserId is not a valid user:
    // Set tracker check valid authUserId.
    const Now_user = getUser(token);
  
    if (!Now_user) {
      // AuthUserId is not a valid user.
      return {
        error: 'Code 401 - AuthUserId is not a valid user'
      };
    }
  

    if (Now_user.password !== oldPassword) {
      return {
        error: 'Code 400 - Old Password is not the correct old password.'
      };
    }
  
    // Check old Password and New Password match exactly:
    if (oldPassword === newPassword) {
      return {
        error: 'Code 400 - Old Password and New Password match exactly.'
      };
    }
  
    // Check new Password has already been used before by this user:
    for (const password of Now_user.oldPasswords) {
        if (oldPassword === Now_user.password) {
            return {
              error: 'Code 400 -New Password has already been used before by this user.'
            };
        }
    }

    // Check new Password is less than 8 characters:
    if (newPassword.length < 8) {
        return {
            error: 'New Password is less than 8 characters.'
        };
    }

    // Check whether newPassword contains at least one number and at least one letter:
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) {
        return { error: 'Code 400 - Password does not contain at least one number and at least one letter.' };
    }
  
    Now_user.password = newPassword;
    Now_user.oldPasswords.push(oldPassword);
    // Update the dataStore.
    setData(data);
  
    return {};
}

  
  

/**
*Logs out an admin user who has an active quiz session.
*
* @param { string } token - the token of the current logged in admin user
* @returns { }
*/

export function adminAuthLogout(token: string): object | {error: string} {
    const data = getData();
    const user = data.users.find((user) => user.token.includes(token));
    // const user = data.users.find((user) => user.token === token);
    if (!user) {
      return { error: 'Code 401 - Token is invalid or already logged out' };
    } else {
        // user.token = null;
        user.token.filter((user) => user === token);
        setData(data);  
        return {};
    }

}
