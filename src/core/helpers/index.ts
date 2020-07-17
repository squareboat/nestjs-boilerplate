import { v4 as uuidv4 } from 'uuid';
import * as queryString from 'query-string';
import * as path from 'path';

export function uuid() {
  return uuidv4();
}

/**
 * Helper to generate random number of n length
 * @param n pass it to generate random numer of particular length
 */
export function randomNumber(n: number): string {
  const add = 1;
  let max = 12 - add;

  if (n > max) {
    return randomNumber(max) + randomNumber(n - max);
  }

  max = Math.pow(10, n + add);
  const min = max / 10; // Math.pow(10, n) basically
  const num = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + num).substring(add);
}

/**
 * Helper to generate random string
 */
export function randomString(length = 0) {
  if (!length)
    return Math.random()
      .toString(36)
      .substr(2);

  let str = '';
  while (length > 0) {
    const tempStr = randomString().substring(0, length);
    length -= length >= tempStr.length ? tempStr.length : 0;
    str = str + tempStr;
  }

  return str;
}

/**
 * Helper to parse object keys
 * @param delimiter
 * @param replace
 * @param object
 */
export function renameObjectKeys(delimiter, replace, object) {
  const objectClone = {};
  const regex = delimiter === '.' ? /\./g : new RegExp(delimiter, 'g');
  for (const key in object) {
    const newKey = key.replace(regex, replace);
    objectClone[newKey] = object[key];
  }

  return objectClone;
}

/**
 * Build URL with query params
 */
export function httpBuildQuery(url, params = {}) {
  return url + '?' + queryString.stringify(params);
}

/**
 * Get Project Base Path.
 */
export function basePath() {
  return path.join(__dirname, '../../../../');
}

/**
 * Helper to generate random token
 */
export function randomToken() {
  return randomString() + randomString();
}

/**
 * Helper to check if given string is a valid email
 */
export function isEmail(email: string) {
  const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  return !!emailRegex.test(email);
}
