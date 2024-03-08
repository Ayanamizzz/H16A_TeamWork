// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//Extract function from dataStore.js to obtain data
import { getData, setData } from './dataStore.js';

//from npmjs.com/package/validator to obtain isEmail
import isEmail from 'validator/lib/isEmail';

/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {authUserId} Id of users
 * 
 * 
*/

function adminAuthRegister(email, password, nameFirst, nameLast) {
    //getdata to data. and i will use data to do the next step
    let data = getData();
    //If allow_display_name is set to true, the validator will also match Display Name <email-address>. 
    //If require_display_name is set to true, the validator will reject strings without the format Display Name <email-address>. 
    //If allow_utf8_local_part is set to false, the validator will not allow any non-English UTF8 character in email address' local part. 
    //If require_tld is set to false, email addresses without a TLD in their domain will also be matched. 
    //If ignore_max_length is set to true, the validator will not check for the standard max length of an email. 
    //If allow_ip_domain is set to true, the validator will allow IP addresses in the host part. 
    //If domain_specific_validation is true, some additional validation will be enabled, 
    //e.g. disallowing certain syntactically valid email addresses that are rejected by Gmail. 
    //If blacklisted_chars receives a string, then the validator will reject emails that include any of the characters in the string, in the name part. 
    //If host_blacklist is set to an array of strings and the part of the email after the @ symbol matches one of the strings defined in it, the validation fails. 
    //If host_whitelist is set to an array of strings and the part of the email after the @ symbol matches none of the strings defined in it, the validation fails.
    const options = { allow_display_name: false, 
        require_display_name: false, 
        allow_utf8_local_part: true, 
        require_tld: true, 
        allow_ip_domain: false, 
        allow_underscores: false, 
        domain_specific_validation: false, 
        blacklisted_chars: '', 
        host_blacklist: [] 
    }
    
    //Query all user's email whether it is query email
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].email === email) {
            return {
                error: 'Email address is used by another user.'
            }
        }
    }
    //Call the isEmail function of the website to determine whether it is an email address
    if (isEmail(email, options) === false) {
        return {
            error: 'Email does not satisfy',
        }
    };

    for (let i = 0; i < nameFirst.length; i++) {
        //charCodeAt can get unicode
        let letter = nameFirst.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    return {
        authUserId: 1,
    }

    for (let i = 0; i < nameLast.length; i++) {
        //charCodeAt i can get unicode to judge the letter.
        let letter = nameLast.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameLast is not vaildNameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    }
}

    //Name must be at least two characters long， Maximum 20 characters




// Description:
// Given a registered user's email and password returns their authUserId value.

    if (nameFirst.length < 2 || nameFirst.length > 20) {
        return {
            error: 'NameFirst is less than 2 characters or more than 20 characters.',
        }
    }

    //Name must be at least two characters long， Maximum 20 characters
    if (nameLast.length < 2 || nameLast.length > 20) {
        return {
            error: 'NameLast is less than 2 characters or more than 20 characters.',
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

    // make a tracker to decide the letter and number
    let isLetter = 0;
    let isNumber = 0;

    //for loop length
    for (let i = 0; i < password.length; i++) {
        const letter = password.charCodeAt(i);
        //The range of A-Z ascii is 65-90
        //The range of ascii for a - z is 97-122
        if ((letter >= 65 && letter <= 90) || (letter >= 97 && letter <= 122)) {
            isLetter = 1;
        } else if (letter >= 48 && letter <= 57) {
            isNumber = 1;
        }
    }

    if (isLetter === 0 || isNumber === 0) {
        return {
            error: 'Password does not contain at least one number and at least one letter.'
        }
    }

    //create a new id from 0
    //and use length to decide how many people we have, and how many id we take

    let new_id = 0;
    const length = data.users.length;

    // if length is 0, it's means is this is the 1st people we register
    if (length === 0) {
        new_id = 0;
    } else {
        // finlly we can get a id for a people
        new_id = length;
    }


    //push users'data to dataStore(and setData to data)
    data.users.push({
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
        authUserId: new_id,
    })
    //Use set to store current user IDs
    setData(data);
    // return userId
    const id = {
        authUserId: new_id,
    }
}





// Description:
// Given details relating to a password change, update the password of a logged in user.

function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    return {
       
    }
}

