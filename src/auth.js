import { getData, setData } from './dataStore.js';

// Description:
// Given details relating to a password change, update the password of a logged in user.
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {

    // Get dataStore
    let data = getData();

    // AuthUserId is not a valid user:
    // Set tracker check vaild authUserId.
    let valid_authUserId = 0;

    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            valid_authUserId = 1;
        }
    } 

    if (valid_authUserId === 0) {
        // AuthUserId is not a valid user.
        return {
            error: 'AuthUserId is not a valid user'
        }
    }

    // Check old Password is not the correct old password:
    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            if (oldPassword !== user.password) {
                return { 
                    error: 'Old Password is not the correct old password.' 
                };
            }
        }
    } 

    // Check old Password and New Password match exactly:
    if (oldPassword === newPassword) {
        return { 
            error: 'Old Password and New Password match exactly.' 
        };
    }

    // Check new Password has already been used before by this user:
    // Set tracker check new password.
    let valid_newPassword = 0;

    for (const user of data.users) {
        if (newPassword === user.password) {
            valid_newPassword = 1;
        }
    } 

    if (valid_newPassword === 1) {
        return { 
            error: 'New Password has already been used before by this user.' 
        };
    }

    // Check new Password is less than 8 characters:
    if (newPassword.length < 8) {
        return {
            error: 'New Password is less than 8 characters.'
        };
    }

    // Check whehther newPassword contain at least one number and at least one letter:
    let Letter = 0;
    let Number = 0;

    for (let i = 0; i < newPassword.length; i++) {
        const letter = newPassword.charCodeAt(i);
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

    // Update the newPassword:
    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            user.password = newPassword;
            break;
        }
    }

    // Update the dataStore.
    setData(data);

    return {};  
}

export { adminUserPasswordUpdate };

