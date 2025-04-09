import { camelCase, startCase } from 'lodash';

export interface Csv2Json$Schema {
  emptyAsNull?: boolean;
}

export class Csv2Json {
  private options: Csv2Json$Schema;

  constructor(private data: string) {}

  handle<T>(): T[] {
    const parsedResult = [];
    const len = this.data.length;
    let i = 0;
    let p = [];
    let a = [];
    let j = [];
    let isNested = false;
    while (i < len) {
      const ch = this.data.charAt(i);
      if (len - i == 1) {
        p.push(ch);
        a.push(p.join(''));
        j.push(a);
        a = [];
        p = [];
      } else if (!isNested && ch === ',') {
        a.push(p.join(''));
        p = [];
      } else if (ch === '\n' && !isNested) {
        a.push(p.join(''));
        j.push(a);
        a = [];
        p = [];
      } else if (ch === '"') {
        isNested = !isNested;
      } else {
        p.push(ch);
      }
      i++;
    }

    if (!j.length) return [];

    const headers = j[0];
    const rows = j.slice(1);

    for (let i in headers) headers[i] = camelCase(headers[i]);

    for (const row of rows) {
      let obj = {};
      for (const i in row) {
        if (row[i].includes('\r')) row[i] = row[i].replace('\r', '');
        for (const i in row)
          obj[headers[i]] = ['\r', ',', '', ''].includes(row[i])
            ? null
            : row[i];
      }
      if (!this.isEmptyRow(obj)) parsedResult.push(obj);
      obj = {};
    }
    return parsedResult;
  }

  isEmptyRow = (obj) => {
    let values = Object.values(obj);
    values.pop(); //removing last element as it always contains '\r\n' etc
    return values.every((value) => {
      if (!value) {
        return true;
      }
      return false;
    });
  };
}
