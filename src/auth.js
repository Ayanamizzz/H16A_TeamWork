import { getData, setData } from './dataStore.js';
import isEmail from 'validator/lib/isEmail';
import { clear } from './other.js'

// Description
// Given an admin user's authUserId and a set of properties, update the properties of this logged in admin user.
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
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

    // Get dataStore.
    let data = getData();

    // Check authUserId is not a valid user:
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

    // Check email address is used by another user:
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].email === email) {
            return {
                error: 'Email address is used by another user.'
            }
        }
    }
    
    // Check email does not satisfy:
    if (isEmail(email, options) === false) {
        return {
            error: 'Email does not satisfy',
        }
    };

    // Check nameFirst or nameLast is not vaildNameFirst contains characters other than lowercase letters, 
    // uppercase letters, spaces, hyphens, or apostrophes.
    for (let i = 0; i < nameFirst.length; i++) {
        // charCodeAt can get unicode
        let letter = nameFirst.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    }

    for (let i = 0; i < nameLast.length; i++) {
        // charCodeAt i can get unicode to judge the letter.
        let letter = nameLast.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameLast is not vaildNameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    }

    // Check namefirst or namefirst is less than 2 characters or more than 20 characters.
    if (nameFirst.length < 2) {
        return {
            error: 'NameFirst is less than 2 characters.',
        }
    }

    if (nameFirst.length > 20) {
        return {
            error: 'NameFirst is more than 20 characters.',
        }
    }

    if (nameLast.length < 2) {
        return {
            error: 'NameLast is less than 2 characters.',
        }
    }

    if (nameLast.length > 20) {
        return {
            error: 'NameLast is more than 20 characters.',
        }
    }

    // Find the user depends on the given authUserId, then update the details.
    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            // update the details.
            user.nameFirst = nameFirst;
            user.nameLast = nameLast;
            user.email = email;

            break;
        }
    }

    // update the dataStore.
    setData(data)

    return {};

}

export { adminUserDetailsUpdate };
