import { getData, setData } from './dataStore.js';
import { clear } from './other.js';


// Description:
// Given an admin user's authUserId, return details about the user. "name" is the first and last name 
// concatenated with a single space between them.

function adminUserDetails(authUserId) {

    // Get dataStore.
    let data = getData();

    // check whether the authUserId is a valid user
    // set tracker check user is exist or not.
    let valid_authUserId = 0;

    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            valid_authUserId = 1;
        }
    }

    if (valid_authUserId === 0) {
        // authUserId is not a valid user.
        return {
            error: 'AuthUserId is not a valid user'
        }
    }


    // user exist, find details of user.
    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            const name = user.nameFirst + ' ' + user.nameLast;
            const email = user.email;
            const numSuccessfulLogins = user.numSuccessfulLogins;
            const numFailedPasswordsSinceLastLogin = user.numFailedPasswordsSinceLastLogin;

            return {
                user:
                {
                    userId: authUserId,
                    name: name,
                    email: email,
                    numSuccessfulLogins: numSuccessfulLogins,
                    numFailedPasswordsSinceLastLogin: numFailedPasswordsSinceLastLogin,
                }
            };

        }
    }

}
export { adminUserDetails };