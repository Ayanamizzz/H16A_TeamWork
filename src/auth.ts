import { getData, setData } from './dataStore.js';
import isEmail from 'validator/lib/isEmail';


// Description
// Given an admin user's authUserId and a set of properties, update the properties of this logged in admin user.

/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {{ userId: number}} An Object contains the new userId after registration
 * 
 * 
*/

export function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): { error: string } | {} {
    const data = getData();

    // Check userId by token:
    const userId = getUserId(token);
    if (userId == null) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    const user = data.users.find((user: user) => user.userId === userId);
    if (user === undefined) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Query all user's email whether it is query email
    for (const user of data.users) {
        if (user.email === email) {
            return { error: 'Email address is used by another user' };
        }
    }

    // Call the isEmail function of the website to determine whether it is an email address
    if (!isEmail(email)) {
        return { error: 'Email does not satisfy' };
    };

    // Name must be at least two characters long， Maximum 20 characters
    const isValidName = (name: string) => /^[\p{L} \-']{2,20}$/u.test(name);
    if (!isValidName(nameFirst)) {
        return { error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
    }

    if (!isValidName(nameLast)) {
        return { error: 'nameLast is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
    }

    // Check namefirst or namefirst is less than 2 characters or more than 20 characters.
    if (nameFirst.length < 2 || nameFirst.length > 20) {
        return { error: 'NameFirst is less than 2 characters or more than 20 characters' };
    }

    if (nameLast.length < 2 || nameLast.length > 20) {
        return { error: 'NameLast is less than 2 characters or more than 20 characters' };
    }

    // Find the user depends on the given authUserId, then update the details.
    let user = getUser(token);
    user.email = email;
    user.nameFirst = nameFirst;
    user.nameLast = nameLast;
    user.name = user.nameFirst + ' ' + user.nameLast;

    setData(data);
    return {};
}



   