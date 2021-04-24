import { get, isObject, orderBy } from 'lodash';

export class Collection {
  public raw: Array<any>;
  public size: number;

  constructor(data?: Array<any>) {
    this.raw = data || [];
    this.size = this.raw.length;
  }

  static make(data?: Array<any>): Collection {
    return new Collection(data);
  }

  first<T>(): T {
    return this.raw[0];
  }

  last<T>(arr: T[]): T {
    return this.raw[this.size - 1];
  }

  isNotEmpty<T>(): boolean {
    return this.size > 0;
  }

  isEmpty<T>(): boolean {
    return this.size == 0;
  }

  remove<T>(elem: T): Collection {
    return new Collection(this.raw.filter((e) => e !== elem));
  }

  pluck(key: string): Collection {
    const values = [];
    if (isObject(this.raw[0])) {
      this.raw.forEach((el) => values.push(get(el, key)));
    }

    return new Collection(values);
  }

  join(delimitter: string): string {
    return this.raw.join(delimitter);
  }

  groupBy<T>(key: string): Record<string, any> {
    const obj = {};
    for (const el of this.raw) {
      const value = get(el, key);
      if (!obj[value]) obj[value] = [];
      obj[value].push(el);
    }

    return obj;
  }

  push(elem: any): this {
    this.raw.push(elem);
    this.size = this.raw.length;
    return this;
  }

  merge(elems: any[]): this {
    this.raw = this.raw.concat(elems);
    this.size = this.raw.length;
    return this;
  }

  where<T>(condition: Record<string, any>): Collection {
    let filteredArray = this.raw;
    for (const key in condition) {
      filteredArray = filteredArray.filter((o) => {
        return get(o, key) === condition[key];
      });
    }
    return new Collection(filteredArray);
  }

  each(cb: Function): void {
    for (const i in this.raw) {
      cb(this.raw[i], i);
    }
  }

  sortByDesc<T>(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['desc']);
  }

  sortBy<T>(arr: T[], key: string): T[] {
    return orderBy(arr, [key], ['asc']);
  }
}
