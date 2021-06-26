export * from './collection';

import { v4 as uuidv4 } from 'uuid';
import * as queryString from 'query-string';
import * as path from 'path';
import { HttpException } from '@nestjs/common';
import { HttpMetadata } from '../http';

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
  if (!length) return Math.random().toString(36).substr(2);

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
  return url + '?' + queryString.stringify(params, { arrayFormat: 'bracket' });
}

export function stringifyQueryParams(params = {}) {
  return queryString.stringify(params, { arrayFormat: 'bracket' });
}

/**
 * Get Project Base Path.
 */
export function basePath() {
  return path.join(__dirname, '../../../../../');
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

/**
 * Get string after a substring
 * @param str
 * @param substr
 */
export function strAfter(str: string, substr: string) {
  return str.split(substr)[1];
}

/**
 * Get string before a substring
 * @param str
 * @param substr
 */
export function strBefore(str: string, substr: string) {
  return str.split(substr)[0];
}

/**
 * Check if value is of type object.
 *
 * @param value
 */
export function isObject(value: any): boolean {
  if (typeof value === 'object' && value !== null) {
    return true;
  }
  return false;
}

/**
 * Check if value is of type array.
 * @param value
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Check if value is empty
 *
 * @param value
 */
export function isEmpty(value: any): boolean {
  if (Array.isArray(value) && value.length < 1) return true;
  if (isObject(value) && Object.keys(value).length < 1) return true;
  if (!value) return true;

  return false;
}

/**
 * Check if value is not empty
 *
 * @param value
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

/**
 * Pick only specified keys from any object
 *
 * @param value
 */
export function pick(
  obj: Record<string, any>,
  keys: Array<string>,
): Record<string, any> {
  const _obj = {};

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      _obj[key] = obj[key];
    }
  }

  return _obj;
}

/**
 * Pick all keys except explicitly mentioned from any object
 *
 * @param value
 */
export function except(
  obj: Record<string, any>,
  keys: Array<string>,
): Record<string, any> {
  const _obj = {};

  for (const key of Object.keys(obj)) {
    if (keys.includes(key)) continue;
    _obj[key] = obj[key];
  }

  return _obj;
}

/**
 * Clone class instance
 */
export function clone<T>(instance: T): T {
  const copy = new (instance.constructor as { new (): T })();
  Object.assign(copy, instance);
  return copy;
}

/**
 * Group by
 */
export function groupBy(
  arr: Array<Record<string, any>>,
  key: string,
): Record<string, any> {
  const obj = {};
  arr.forEach((o) => {
    obj[o[key]] = o;
  });

  return obj;
}

/**
 * Check if passed variable if a type of Function
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Run if function,
 * else return undefined
 * @param value
 */
export function runIfFunction(value: any, defaultVal: any) {
  if (isFunction(value)) return value();
  return defaultVal || null;
}

export function throwIf(expression: boolean, exception: HttpException) {
  if (expression) {
    throw exception;
  }
}

export function invertObj(obj: Record<string, any>): Record<string, any> {
  const newObj = {};
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[obj[prop]] = prop;
    }
  }
  return newObj;
}

export function route(name: string, params?: Object): string {
  return HttpMetadata.getRoute(name, params);
}
