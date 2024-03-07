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
    let data = getData();
    // check whether the authUserId is a valid user
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].authUserId === authUserId) {
            // Check whether the oldPassword is the correct old password
            if (data.users[i].password === oldPassword) {
                // Check whether the newPassword has been used by others
                for (let i = 0; i < data.users.length; i++) {
                    if (data.users[i].password === newPassword) {
                        return {
                            error: 'Password is used by another user.'
                        }
                    }
                }
                // Check whether the newPassword.length satisfy or not
                if (password.length < 8) {
                    return {
                        error: 'Password is less than 8 characters.',
                    }
                }
                // Check whehther newPassword contain at least one number and at least one letter.
                let Letter = 0;
                let Number = 0;
                for (let i = 0; i < password.length; i++) {
                    const letter = password.charCodeAt(i);
                    if ((letter >= 65 && letter <= 90) || (letter >= 97 && letter <= 122)) {
                        Letter = 1;
                    } else if (letter >= 48 && letter <= 57) {
                        Number = 1;
                    }
                }
                if (Letter === 0 || Number === 0) {
                    return {
                        error: 'Password does not contain at least one number and at least one letter.'
                    }
                }
                // Update the password with newPassword
                setData(data);
                data.users[i].password = newPassword;
                return {}

            } else {
                return { error: 'Old Password is not the correct old password.' }
            }
        }
        return { error: 'AuthUserId is not a valid user.' }
    }

}






export { adminUserPasswordUpdate };

