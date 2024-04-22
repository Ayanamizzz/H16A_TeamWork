import { getData, setData } from './dataStore';
import { user, token } from './dataStore';
import validator from 'validator';
import CryptoJS from 'crypto-js';

/**
 * Register a new admin user.
 *
 * @param {string} email - the email of the current logged in admin user
 * @param {string} password - the password of the current logged in admin user
 * @param {string} nameFirst - the first name of the current logged in admin user
 * @param {string} nameLast - the last name of the current logged in admin user
 * @returns {{ authUserId: number }}
 *
 */
export function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): any {
  if (emailIsTaken(email)) {
    return { error: 'email has already been registered' };
  } else if (!validator.isEmail(email)) {
    return { error: 'email is invalid' };
  } else if (!validName(nameFirst)) {
    return { error: 'nameFirst must only contain letters, spaces, hyphens, or apostrophes' };
  } else if (nameFirst.length < 2) {
    return { error: 'nameFirst must be longer than 2 characters' };
  } else if (nameFirst.length > 20) {
    return { error: 'nameFirst cannot be longer than 20 characters' };
  } else if (!validName(nameLast)) {
    return { error: 'nameLast must only contain letters, spaces, hyphens, or apostrophes' };
  } else if (nameLast.length < 2) {
    return { error: 'nameLast must be longer than 2 characters' };
  } else if (nameLast.length > 20) {
    return { error: 'nameLast cannot be longer than 20 characters' };
  } else if (password.length < 8) {
    return { error: 'password must be longer than 8 characters' };
  } else if (!/[a-zA-Z]/.test(password)) {
    return { error: 'password must contain at least 1 letter' };
  } else if (!/[0-9]/.test(password)) {
    return { error: 'password must contain at least 1 number' };
  }
  const dataStore = getData();
  const users = dataStore.users;
  const newId = users.length;
  users.push({
    userId: newId,
    name: {
      nameFirst: nameFirst,
      nameLast: nameLast,
      nameFull: `${nameFirst} ${nameLast}`,
    },
    email: email,
    password: sha256Hash(password),
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizzesCreated: [],
    pastPasswords: [],
  });
  setData(dataStore);
  return { authUserId: newId };
}

/**
 * Login an admin user.
 *
 * @param {string} email - the email of the current logged in admin user
 * @param {string} password - the password of the current logged in admin user
 * @returns {{ authUserId: number }}
 *
 */
export function adminAuthLogin(email: string, password: string): { authUserId: number } | { error: string } {
  const dataStore = getData();
  const users = dataStore.users;
  const user = users.find((user: user) => user.email === email);
  if (user === undefined) {
    return { error: 'email does not exist' };
  }
  if (user.password !== sha256Hash(password)) {
    // Update numFailedPasswords
    dataStore.users.find((user: user) => user.email === email).numFailedPasswordsSinceLastLogin++;
    setData(dataStore);
    return { error: 'password was incorrect for given email' };
  }
  // Update numSuccessful logins
  dataStore.users.find((user: user) => user.email === email).numSuccessfulLogins++;
  dataStore.users.find((user: user) => user.email === email).numFailedPasswordsSinceLastLogin = 0;
  setData(dataStore);
  return { authUserId: user.userId };
}

/**
 * Logs out an admin user who has an active quiz session.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 */
export function adminAuthLogout(authUserId: number): any | { error: string } {
  const data = getData();
  const user = data.users.find((user: user) => user.userId === authUserId);
  // Not used. Commented out if needed at later time
  // const token = data.tokens.find((token: token) => token.authUserId === authUserId);
  user.numSuccessfulLogins = 0;
  const indexToRemove = data.tokens.findIndex((token: token) => token.authUserId === authUserId);
  data.trash.splice(indexToRemove, 1);
  setData(data);
  return {};
}

/**
 * Get the details of this admin user(non-password).
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 */
export function adminUserDetails(authUserId: number): any | { error: string } {
  const data = getData();
  const user = data.users.find((user: user) => user.userId === authUserId);
  return {
    user: {
      userId: user.userId,
      name: user.name.nameFull,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin
    }
  };
}

/**
 * Update the details of this admin user(non-password).
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} email - the email of the current logged in admin user
 * @param {string} nameFirst - the first name of the current logged in admin user
 * @param {string} nameLast - the last name of the current logged in admin user
 *
 */
export function adminUserDetailUpdate(authUserId: number, email: string, nameFirst: string, nameLast: string): any | { error: string } {
  const dataStore = getData();
  const user = dataStore.users.find((user:user) => user.userId === authUserId);
  if (emailIsTaken(email)) {
    return { error: 'Email is currently used by another user (excluding the current authorised user)' };
  } else if (!validator.isEmail(email)) {
    return { error: 'email is invalid' };
  } else if (!validName(nameFirst)) {
    return { error: 'NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (nameFirst.length < 2) {
    return { error: 'NameFirst is less than 2 characters' };
  } else if (nameFirst.length > 20) {
    return { error: 'NameFirst is more than 20 characters' };
  } else if (!validName(nameLast)) {
    return { error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' };
  } else if (nameLast.length < 2) {
    return { error: 'NameLast is less than 2 characters' };
  } else if (nameLast.length > 20) {
    return { error: 'NameLast is more than 20 characters' };
  }
  user.email = email;
  user.name.nameFirst = nameFirst;
  user.name.nameLast = nameLast;
  user.name.nameFull = `${nameFirst} ${nameLast}`;
  setData(dataStore);
  return {};
}

/**
 * Update the password of this admin user.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} oldPassword - the oldPassword of the current logged in admin user
 * @param {string} newPassword - the newPassword of the current logged in admin user
 *
 */
export function adminUserPasswordUpdate(authUserId: number, oldPassword: string, newPassword: string): any | { error: string } {
  const data = getData();
  const user = data.users.find((user: user) => user.userId === authUserId);
  if (sha256Hash(oldPassword) !== user.password) {
    return { error: 'Old Password is not the correct old password' };
  } else if (newPassword.length < 8) {
    return { error: 'password must be longer than 8 characters' };
  } else if (!/[a-zA-Z]/.test(newPassword)) {
    return { error: 'password must contain at least 1 letter' };
  } else if (!/[0-9]/.test(newPassword)) {
    return { error: 'password must contain at least 1 number' };
  } else if (user.pastPasswords.includes(sha256Hash(newPassword))) {
    return { error: 'New Password has already been used before by this user' };
  }
  user.pastPasswords.push(sha256Hash(oldPassword));
  user.password = sha256Hash(newPassword);
  setData(data);
  return {};
}

// Helper Functions:
/**
 * Returns bool that email is taken or not.
 */
function emailIsTaken(email: string): boolean {
  const dataStore = getData();
  const users = dataStore.users;
  if (users !== undefined && users.length > 0) {
    const user = users.find((user: user) => user.email === email);
    return user !== undefined;
  }
  return false;
}

/**
 * Returns bool that name follows the format or not.
 */
function validName(name: string): boolean {
  const condition = /[^a-zA-Z\s-'"]/;
  return !condition.test(name);
}

/**
 * Returns a hexadecimal SHA256 hash of input returned as a string.
 */
function sha256Hash(data: string | number): string {
  // Below tep is necessary as a hash of a number will be different to a hash of the string of that number.
  const dataToHash = data.toString();
  const hash = CryptoJS.SHA256(dataToHash);
  // Below step is necessary such that the hash to returned as hexadecimal string and not a binary string.
  return hash.toString(CryptoJS.enc.Hex);
}
