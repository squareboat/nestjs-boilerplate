import { compact, concat, intersection, uniq, camelCase } from 'lodash';
import { Context } from '../utils/Context';

export abstract class Transformer {
  availableIncludes = [];
  defaultIncludes = [];
  protected includes = [];
  ctx = new Context();

  abstract async transform(object: any): Promise<Record<string, any> | null>;

  /**
   * Use this when
   * @param obj
   */
  primitive(obj?: Record<string, any>) {
    return obj;
  }

  /**
   * Use this when you want to include single object,
   * which is transformed by some other transformer.
   *
   * @param obj
   * @param transformer
   * @param options
   */
  async item(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    options = options || {};
    if (!obj) return null;
    return await transformer.parseIncludes(options.include).work(obj);
  }

  /**
   * Use this when you want to include multiple objects,
   * which is transformed by some other transformer.
   *
   * @param arr
   * @param transformer
   * @param options
   */
  async collection(
    arr: Array<Record<string, any> | string>,
    transformer: Transformer,
    options?: Record<string, any>,
  ): Promise<Array<any>> {
    if (!arr || arr.length === 0) return [];
    options = options || {};
    const result = [];
    for (let data of arr) {
      data = await transformer.parseIncludes(options.includes).work(data);
      result.push(data);
    }

    return result;
  }

  parseIncludes(include = ''): this {
    let includes = include.split(',');
    const allIncludes = this.availableIncludes.concat(this.defaultIncludes);
    includes = intersection(includes, allIncludes);
    includes = uniq(concat(includes, this.defaultIncludes));
    includes = compact(includes);
    this.includes = includes;
    return this;
  }

  async work(data): Promise<Record<string, any> | Array<Record<string, any>>> {
    let result = {};

    // transform data
    if (data instanceof Object) {
      result = await this.transform(data);
    }

    // handle includes and nested includes
    for (const include of this.includes) {
      const arr = await this.handleInclude(data, include);
      if (!arr) {
        continue;
      }
      result[arr[0]] = arr[1];
    }

    return result;
  }

  async handleInclude(
    data: Record<string, any>,
    include: string,
  ): Promise<Record<string, any>> {
    // check if include contains nested includes also
    const hasNestedIncludes = include.indexOf('.');
    let parentInclude = include;
    if (hasNestedIncludes >= 0) {
      parentInclude = include.substr(0, include.indexOf('.'));
    }

    const handler = camelCase('include ' + parentInclude);
    if (!this[handler]) {
      return undefined;
    }

    const result = this[handler](data, {
      includes: include.substr(include.indexOf('.')).replace(/./g, ','),
    });

    return [parentInclude, await result];
  }
}
