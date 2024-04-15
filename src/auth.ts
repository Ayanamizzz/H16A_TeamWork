import validator from 'validator';
import { getData, setData } from './dataStore';
import { nanoid } from 'nanoid';
import { getUser } from './other';
import HTTPError from 'http-errors';

interface userInDetail {
  userId: number;
  name: string;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}


/**
 * Register a new admin user.
 * 
 * @param {string} email - the email of the current logged in admin user
 * @param {string} password - the password of the current logged in admin user
 * @param {string} nameFirst - the fisrt name of the current logged in admin user
 * @param {string} nameLast - the last name of the current logged in admin user
 * @returns {{token: string}}
 *
 */

export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): { token: string } | { error: string } {
  const data = getData();

  // Query all user's email whether it is query email
  for (const user of data.users) {
    if (email === user.email) {
      return { error: 'Email address is used by another user.' };
    }
  }

  // Call the isEmail function of the website to determine whether it is an email address
  if (!validator.isEmail(email)) {
    return { error: ' Code 400 - Email does not satisfy.' };
  }

  // Name must be at least two characters long， Maximum 20 characters
  const isValidName = /^[a-zA-Z\s'-]+$/;
  if (isValidName.test(nameFirst) === false) {
    return { error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (isValidName.test(nameLast) === false) {
    return { error: 'nameLast is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  }

  // Check namefirst or namefirst is less than 2 characters or more than 20 characters.
  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return { error: 'NameFirst is less than 2 characters or more than 20 characters' };
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    return { error: 'NameLast is less than 2 characters or more than 20 characters' };
  } else if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return { error: 'Password is less than 8 characters or does not contain at least one number and at least one letter' };
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
  };

  let token;
  do {
    token = nanoid(10);
  } while (!isnotSameToken(token));

  // push users'data to dataStore(and setData to data)
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
  });

  setData(data);
  return { token: token };
}


/**
 * Login an admin user.
 * 
 * @param {string} email - the email of the current logged in admin user
 * @param {string} password - the password of the current logged in admin user
 * @returns {{token: string}}
 *
 */

export function adminAuthLogin(email: string, password: string): { token: string } | { error: string} {
  const data = getData();

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
        };

        let token: string;
        do {
          token = nanoid(10);
        } while (!isnotSameToken(token));

        user.token.push(token);
        setData(data);

        return { token: token };
  
      } else {
        user.numFailedPasswordsSinceLastLogin++;
        setData(data);
        return { error: 'Password is not correct for the given email' };
      }
    }
  }

  // Error address does not exist
  setData(data);
  return { error: 'Email address does not exist' };
}


/** 
 * Logs out an admin user who has an active quiz session.
 * 
 * @param {string} token - the token of the current logged in admin user
 * @returns {} 
 */

export function adminAuthLogout(token: string): object | { error: string } {
  const data = getData();

  const user = data.users.find((user) => user.token.includes(token));
  if (!user) { 
    throw HTTPError(401, 'Token does not refer to valid logged in user quiz session.');
  } 
	
  const i = user.token.indexOf(token);
  user.token.splice(i, 1);

  setData(data);
  return {};
}


/**
 * Get the details of this admin user(non-password).
 *
 * @param {string} token - the token of the current logged in admin user
 * @returns {{user}} - user details
 */

export function adminUserDetails(token: string): { user: userInDetail } | { error: string } {
  const currentUser = getUser(token);

  if (currentUser == null) {
    throw HTTPError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  return {
    user:
      {
        userId: currentUser.userId,
        name: currentUser.nameFirst + ' ' + currentUser.nameLast,
        email: currentUser.email,
        numSuccessfulLogins: currentUser.numSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: currentUser.numFailedPasswordsSinceLastLogin,
      }
  };
}


/**
 * Update the details of this admin user(non-password).
 * 
 * @param {string} token - the token of the current logged in admin user
 * @param {string} email - the email of the current logged in admin user
 * @param {string} nameFirst - the first name of the current logged in admin user
 * @param {string} nameLast - the last name of the current logged in admin user
 * @returns {}
 *
 */

export function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): {} | { error: string } {
  const data = getData();

  const currentUser = getUser(token);
  if (currentUser == null) {
    throw HTTPError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  for (const user of data.users) {
    if (user.email === email && user.userId !== currentUser.userId) {
      throw HTTPError(400, 'Email is currently used by another user.');
    }
  }

  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Email does not satisfy.');
  }

  const isValidName = /^[a-zA-Z\s'-]+$/;
  if (!isValidName.test(nameFirst)) {
    throw HTTPError(400, 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.');
  } else if (!isValidName.test(nameLast)) {
    throw HTTPError(400, 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.');
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw HTTPError(400, 'NameFirst is less than 2 characters or more than 20 characters.');
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    throw HTTPError(400, 'NameLast is less than 2 characters or more than 20 characters.');
  }

  // find the user depends on the given authUserId, then update the details.
  const user = getUser(token);
  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  setData(data);
  return {};
}


/**
 * Update the password of this admin user.
 * 
 * @param {string} token - the token of the current logged in admin user
 * @param {string} oldPassword - the oldPassword of the current logged in admin user
 * @param {string} newPassword - the newPassword of the current logged in admin user
 * @returns {}
 *
 */

export function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): {} | { error: string } {
  const data = getData();

  const currentUser = getUser(token);
  if (currentUser === null) {
    throw HTTPError(401, 'Token does not refer to valid logged in user quiz session.');
  } 
  
  if (currentUser.password !== oldPassword) {
    throw HTTPError(400, 'Old Password is not the correct old password.');
  } else if (oldPassword === newPassword) {
    throw HTTPError(400, 'Old Password and New Password match exactly.');
  }

  for (const password of currentUser.oldPasswords) {
    if (password === newPassword) {
      throw HTTPError(400, 'New Password has already been used before by this user.');
    }
  }

  if (newPassword.length < 8) {
    throw HTTPError(400, 'New Password is less than 8 characters.');
  }

  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  if (!hasLetter && !hasNumber) {
    throw HTTPError(400, 'New Password does not contain at least one number and at least one letter.');
  }

  currentUser.password = newPassword;
  currentUser.oldPasswords.push(oldPassword);
  setData(data);
  return {};
}
