// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//Extract function from dataStore.js to obtain data
//from npmjs.com/package/validator to obtain isEmail
import isEmail from 'validator/lib/isEmail';
import { getData, setData } from './dataStore.js';
import { User } from './dataStore.js';
import { nanoid } from 'nanoid';



/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {{token: string}} Id of users
 * 
 * 
*/


// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.



export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { token: string } | {error: string} {
    //getdata to data. and i will use data to do the next step
    const data = getData();

  
    const options = { 
        allow_display_name: false, 
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
    for (const user of data.users) {
        if (user.email === email) {
            return {
                error: 'Email address is used by another user.'
            }
        }
    }
    //Call the isEmail function of the website to determine whether it is an email address
    if (!isEmail(email, options)) {
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
            for (const item of user.item) {
                if (item === token) {
                    return false;
                }
            }
        }
        return true;
    }
    
    let token;
    do {
        token = nanoid(10);
    } while (!isnotSameToken(token));

    //push users'data to dataStore(and setData to data)

    const newUser: User = {
        userId: userId,
        nameFirst: nameFirst,
        nameLast: nameLast, 
        email: email,
        password: password,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
        item: [],
    };
    newUser.item.push(token);
    //Use set to store current user IDs
    data.users.push(newUser);
    setData(data);
    return { token: token};
}




// Description:
// Given a registered user's email and password returns their authUserId value.

export function adminAuthLogin(email: string, password: string) {
    //Access data Extract data from the database
    let data = getData();
    //Determine whether the mailbox is duplicated
    for (let i = 0; i < data.users.length; i++) {
        //decide emaill = emial in dataStore
        if (data.users[i].email === email) {
            if (data.users[i].password === password) {
                // Detail need these code to record times of fail login
                data.users[i].numSuccessfulLogins++;
                data.users[i].numFailedPasswordsSinceLastLogin = 0;
                setData(data);
                return {
                    authUserId: data.users[i].userId
                }
            } else {
                // Detail need these code to record times of successful login
                data.users[i].numFailedPasswordsSinceLastLogin++;
                setData(data);
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





// Description:
// Given an admin user's authUserId and a set of properties, update the properties of this logged in admin user.

function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    return {
 
    }
}

    



// Description:
// Given details relating to a password change, update the password of a logged in user.

function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    return {
       
    }
}

