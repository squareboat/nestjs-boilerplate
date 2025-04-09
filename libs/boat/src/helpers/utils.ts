import { ulid } from 'ulid';

export class Utils {
  /**
   * Helper to generate random number of n length
   * @param n pass it to generate random numer of particular length
   */
  static randomNumber(n: number): string {
    const add = 1;
    let max = 12 - add;

    if (n > max) {
      return Utils.randomNumber(max) + Utils.randomNumber(n - max);
    }

    max = Math.pow(10, n + add);
    const min = max / 10; // Math.pow(10, n) basically
    const num = Math.floor(Math.random() * (max - min + 1)) + min;

    return ('' + num).substring(add);
  }

  /**
   * Helper to generate random string
   */
  static randomString(length = 0) {
    if (!length) return Math.random().toString(36).substr(2);

    let str = '';
    while (length > 0) {
      const tempStr = Utils.randomString().substring(0, length);
      length -= length >= tempStr.length ? tempStr.length : 0;
      str = str + tempStr;
    }

    return str;
  }

  static IsNumeric(input) {
    return input - 0 == input && ('' + input).trim().length > 0;
  }

  static csvToJSON(csv) {
    let lines = csv.split('\n');
    let result = [];
    let headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentLine = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim().toLowerCase()] = currentLine[j].trim();
      }
      result.push(obj);
    }
    return result;
  }

  //handles cases which parseInt can't eg. null => null, '1,1'=>1,1, '23.4'=>23
  static parseIntIfNumber(number) {
    if (!number) return null;
    let val = Number(number);
    if (!isNaN(val)) {
      val = parseInt(val as unknown as string);
      return val;
    }
    return number;
  }

  static ulid() {
    return ulid();
  }
}
