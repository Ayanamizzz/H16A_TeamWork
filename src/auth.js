import { getData, setData } from './dataStore.js';
import isEmail from 'validator/lib/isEmail';
import { clear } from './others.js'
// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1,
    }
}





// Description:
// Given a registered user's email and password returns their authUserId value.

function adminAuthLogin(email, passworld) {
    return {
        authUserId: 1,
    }
}





// Description:
// Given an admin user's authUserId, return details about the user. "name" is the first and last name 
// concatenated with a single space between them.

function adminUserDetails(authUserId) {
    return {
        user:
        {
            userId: 1,
            name: 'Hayden Smith',
            email: 'hayden.smith@unsw.edu.au',
            numSuccessfulLogins: 3,
            numFailedPasswordsSinceLastLogin: 1,
        }
    }
}




//Description
//Given an admin user's authUserId and a set of properties, update the properties of this logged in admin user.

function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    let data = getData();
    // Check whether the authUserId is a valid user
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].authUserId === authUserId) {
            // check whether the email has already been used by others
            for (let i = 0; i < data.users.length; i++) {
                if (data.users[i].authUserId !== authUserId && data.users[i].email === email) {
                    return { error: 'Email is currently used by another user' };
                }
            }
            // check whether email is satisfiy or not
            if (isEmail(email, options) === false) {
                return {
                    error: 'Email does not satisfy',
                }
            };
            // Check whether nameFirst is satisfy or not
            for (let i = 0; i < nameFirst.length; i++) {
                let letter = nameFirst.charCodeAt(i);
                if (letter > 122 || (letter < 65 && letter != 32 && letter != 45 && letter != 39)) {
                    return {
                        error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
                    }
                }
            }
            // Check whether nameLast is satisfy or not
            for (let i = 0; i < nameLast.length; i++) {
                let letter = nameLast.charCodeAt(i);
                if (letter > 122 || (letter < 65 && letter != 32 && letter != 45 && letter != 39)) {
                    return {
                        error: 'nameLast is not vaildNameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
                    }
                }
            }
            // Check whether the nameFirst.length satsify or not
            if (nameFirst.length < 2 || nameFirst.length > 20) {
                return {
                    error: 'NameFirst is less than 2 characters or more than 20 characters.',
                }
            }

            // Check whether the nameLast.lenght satisfy or not
            if (nameLast.length < 2 || nameLast.length > 20) {
                return {
                    error: 'NameLast is less than 2 characters or more than 20 characters.',
                }
            }
            setData(data);
            data.users[i].email = email;
            data.users[i].nameFirst = nameFirst;
            data.users[i].nameLast = nameLast;
            break;
        }
    }
    return {}
}







// Description:
// Given details relating to a password change, update the password of a logged in user.

function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    return {
       
    }
}






export { adminUserDetailsUpdate };