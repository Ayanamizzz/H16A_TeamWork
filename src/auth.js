import { getData, setData } from './dataStore.js';
import { clear } from './other.js';
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
    let data = getData();
    // check whether the authUserId is a valid user
    for (let i = 0; i < data.users.length; i++) {

        if (data.users[i].authUserId === authUserId) {
            name = data.users[i].nameFirst + data.users[i].nameLast;
            email = data.users[i].email;

            // Checking for the number of successful login and number wrong password since last successful login
            const result = adminAuthLogin(email, password);
            let numFailedPasswordsSinceLastLogin = 0;
            let numSuccessfulLogins = 1;
            if (result === authUserId) {
                numSuccessfulLogins++;
                numFailedPasswordsSinceLastLogin = 0;
            } else if (result === 'error') {
                numFailedPasswordsSinceLastLogin++;
            }
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
        return {
            error: 'AuthUserId is not a valid user.'
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




export { adminUserDetails };