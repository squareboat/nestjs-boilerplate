import { ulid } from 'ulid';
import { cloneDeep } from 'lodash';
import {
  GenericException,
  ValidationFailed,
  ForbiddenException,
  NotFoundException,
} from '../exceptions';
import { TimebasedRefId } from '../interfaces';
import { ExpParser } from '../utils';
import { Utils } from './utils';
import { Csv2Json } from './csvToJson';

/**
 * Get string after a substring
 * @param str string
 * @param substr string
 */
export function strAfter(str: string, substr: string) {
  return str.split(substr)[1];
}

/**
 * Get string before a substring
 * @param str string
 * @param substr string
 */
export function strBefore(str: string, substr: string) {
  return str.split(substr)[0];
}

export function isArrayAndHasLength(arr: any) {
  return arr && Array.isArray(arr) && arr.length;
}

export class Helpers {
  static slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  static o2s(inputs: Record<string, any>): string {
    return ExpParser.buildFromObj(inputs);
  }

  static throwGenericIf(condition: boolean, msg: string): void {
    if (condition) throw new GenericException(msg);
  }

  static throwNotFoundIf(condition: boolean, msg: string): void {
    if (condition) throw new NotFoundException(msg);
  }

  static throwForbiddenIf(
    condition: boolean,
    error: Record<string, any>,
  ): void {
    if (condition) throw new ForbiddenException(error);
  }

  static throwIf(condition: boolean, ex: Error): void {
    if (condition) throw ex;
  }

  static throwValidationIf(condition: boolean, msg: Record<string, any>): void {
    if (condition) throw new ValidationFailed(msg);
  }

  static isLocal(): boolean {
    return process.env.APP_STAGE === 'local';
  }

  static isObject(value: any): boolean {
    if (typeof value === 'object' && value !== null) {
      return true;
    }
    return false;
  }

  static isEmpty(value): boolean {
    if (Array.isArray(value) && value.length < 1) return true;
    if (this.isObject(value) && Object.keys(value).length < 1) return true;
    if (!value) return true;

    return false;
  }

  static referenceId(length: number): string {
    const char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return this.randomString(length, char);
  }

  static randomString(length: number, str?: string) {
    let result = '';
    const characters = str
      ? str
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static timeBasedRefId(options?: TimebasedRefId): string {
    options = options || {};
    const dateObj = new Date();
    const date = dateObj
      .toISOString()
      .split('T')[0]
      .substr(2)
      .replace(/-/g, '');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const timestamp = `${date}${hours}${minutes}`;
    const str = Utils.randomString(options?.len || 8).toUpperCase();
    const prefix = options.prefix || '';
    return `${prefix.trim()}${timestamp}${str}`;
  }

  static getFormattedEager(
    include = '',
    eagerDependencyMapping: Record<string, any>,
  ): Record<string, any> {
    const commonEager = {};
    Object.keys(eagerDependencyMapping).filter((val) => {
      const arr: string[] = include.split(',');
      const isMatched = arr.includes(val);
      if (isMatched) {
        commonEager[val] = true;
      }
      return isMatched;
    });

    return commonEager;
  }

  static getSanitizeKeywordStringForES(str: string) {
    // The reserved characters are: + - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /
    return str
      .replace('|', '')
      .replace('+', '')
      .replace('-', '')
      .replace('=', '')
      .replace('&', '')
      .replace('>', '')
      .replace('<', '')
      .replace('!', '')
      .replace('(', '')
      .replace(')', '')
      .replace('{', '')
      .replace('}', '')
      .replace('^', '')
      .replace('"', '')
      .replace('*', '')
      .replace('?', '')
      .replace(':', '')
      .replace('/', '')
      .replace(']', '')
      .replace('[', '')
      .replace('~', '')
      .replace('\\', '');
  }

  static csv2json<T>(data: string): T[] {
    return new Csv2Json(data).handle<T>();
  }

  static groupCSVFieldsToArray = (inputObj, splitBy = 'configuration') => {
    const ToSkipConfiguration = ['FolderLink'];
    const dataMap = {};

    for (let key in inputObj) {
      let splitKeyArr = key.split(splitBy);

      if (splitKeyArr.length !== 2) continue;

      let splitKey = splitKeyArr[1];

      if (ToSkipConfiguration.includes(splitKey)) continue;

      let configNo = splitKey.replace(/[^0-9]/g, '');

      let objKey = splitKey.split(configNo)[1]; //type
      objKey = objKey.toLowerCase();

      if (dataMap.hasOwnProperty(configNo)) {
        dataMap[configNo][objKey] = inputObj[key]; // {1:{type:2, nae:4}}
      } else {
        dataMap[configNo] = {
          [objKey]: inputObj[key],
          id: configNo,
        };
      }
    }

    const finalConfigArray = [];
    for (let key in dataMap) {
      finalConfigArray.push(dataMap[key]);
    }
    return finalConfigArray;
  };

  static getKeyByValue(val, obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === val) {
        return key;
      }
    }
  }

  static ulid() {
    return ulid();
  }

  static generatePass() {
    let pass = '';
    let lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    let upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let digits = '0123456789';
    let specialChars = '@#$';
    let allChars = lowerCase + upperCase + digits + specialChars;

    pass += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
    pass += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
    pass += digits.charAt(Math.floor(Math.random() * digits.length));
    pass += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length),
    );

    for (let i = pass.length; i < 8; i++) {
      pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    pass = pass
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return pass;
  }

  static makeQueryParam = (param) => {
    if (!param) return '';
    let query =
      '?' +
      Object.keys(param)
        .map((data) => {
          return data + '=' + encodeURIComponent(param[data]);
        })
        .join('&');

    return query;
  };

  //flattens a object eg: {a:{b:{c:1}}} to {a.b.c = 1}
  static objectToFlatObject = (
    currentNode: Record<string, any>,
    target: Record<string, any> = {},
    flattenedKey?: string,
  ) => {
    for (let key in currentNode) {
      if (currentNode.hasOwnProperty(key)) {
        let newKey;
        if (flattenedKey === undefined) {
          newKey = key;
        } else {
          newKey = flattenedKey + '.' + key;
        }
        let value = currentNode[key];
        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null
        ) {
          Helpers.objectToFlatObject(value, target, newKey);
        } else {
          target[newKey] = value;
        }
      }
    }
  };

  static flatObjectToObject = (
    target: Record<string, any>,
    keySeparator: string = '.',
  ) => {
    let result = {};
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        let nestedKeys = key.split(keySeparator);
        let leaf = nestedKeys[nestedKeys.length - 1];
        let branch = nestedKeys.slice(0, nestedKeys.length - 1);

        let currentTarget = result;
        for (let i = 0; i < branch.length; i += 1) {
          let subKey = nestedKeys[i];
          if (currentTarget[subKey] === undefined) {
            currentTarget[subKey] = {};
          }
          currentTarget = currentTarget[subKey];
        }
        currentTarget[leaf] = target[key];
      }
    }
    return result;
  };

  //return first level ids from category mapping, used to only insert valid fields in database
  static getIdsFromCategoryMapping = (mapping: Record<string, any>) => {
    const firstLevelIds: any = {};

    for (const field of mapping.optional) {
      if (field.id) {
        firstLevelIds.optional = firstLevelIds.optional || [];
        firstLevelIds.optional.push(field.id);
      }
    }
    for (const field of mapping.mandatory) {
      if (field.id) {
        firstLevelIds.mandatory = firstLevelIds.mandatory || [];
        firstLevelIds.mandatory.push(field.id);
      }
    }
    return firstLevelIds;
  };

  static getCDNUrl = (slug) => {
    if (!slug) return;
    return `${process.env.AWS_S3_PUBLIC_CDN}/${slug}`;
  };

  static cacheKeyfromObj(inputsOriginal: Record<string, any>): string {
    const inputs = cloneDeep(inputsOriginal);
    for (const key in inputs) {
      const type = typeof inputs[key];
      if (type === 'string' || type === 'number' || type === 'boolean') {
        inputs[key] = [inputs[key]];
      }
    }

    const keys = Object.keys(inputs).sort();
    let str = '';
    for (const key of keys) {
      str += `,${key}`;
      if (Array.isArray(inputs[key]) && inputs[key].length > 0) {
        const values = inputs[key].sort();
        str += `[${values.join(',')}]`;
      }
    }

    return str.slice(1);
  }

  static convertToIST(timestamp) {
    if (!timestamp || isNaN(timestamp)) {
      throw new Error('Invalid timestamp provided.');
    }
    // Convert seconds to milliseconds
    const date = new Date(timestamp * 1000);

    // Convert to IST (UTC+5:30)
    // const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime());

    return istDate.toString(); // Returns IST formatted date
  }
}
