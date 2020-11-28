import { compact, concat, intersection, uniq, camelCase, set } from 'lodash';
import { Context } from '../utils/Context';

export abstract class Transformer {
  availableIncludes = [];
  defaultIncludes = [];
  protected includes = [];
  ctx = new Context();

  abstract transform(object: any): Promise<Record<string, any> | null>;

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
    let includes = include.split(/,(?=(((?!\]).)*\[)|[^\[\]]*$)/);
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
      const map = await this.handleInclude(data, include);
      if (!map) continue;

      for (const key in map) {
        set(result, key, map[key]);
      }
    }

    return result;
  }

  async handleInclude(
    data: Record<string, any>,
    include: string,
  ): Promise<Record<string, any>> {
    // check if include contains nested includes also
    const includeMap = {};

    const toInclude = include.split(/\.(?![^[]*\])/);
    await this.computeNestedInclude(toInclude, 0, includeMap, data, include);

    // same level includes
    for (let i = 0; i < toInclude.length; i++) {
      if (toInclude[i].charAt(0) === '[') {
        toInclude[i] = toInclude[i].slice(1, -1);
        const sameLvl = toInclude[i].split(',');
        for (let j = 0; j < sameLvl.length; j++) {
          if (sameLvl[j].split('.').length != 1) {
            const nestMap = {};
            const newArray = sameLvl[j].split('.');
            await this.computeNestedInclude(
              newArray,
              0,
              nestMap,
              data,
              include,
            );
            for (const key in nestMap) {
              includeMap[toInclude.slice(0, i).join('.') + '.' + key] =
                nestMap[key];
            }
            continue;
          }

          includeMap[
            toInclude.slice(0, i).join('.') + '.' + sameLvl[j]
          ] = await this.fetchData(sameLvl[j], data, include);
        }
      }
    }

    return includeMap;
  }

  private async computeNestedInclude(
    toInclude: string[],
    i: number,
    includeMap: Record<string, any>,
    data: Record<string, any>,
    include: string,
  ) {
    if (i === toInclude.length) return;

    if (toInclude[i].charAt(0) != '[') {
      includeMap[toInclude.slice(0, i + 1).join('.')] = await this.fetchData(
        toInclude[i],
        data,
        include,
      );
      return this.computeNestedInclude(
        toInclude,
        i + 1,
        includeMap,
        data,
        include,
      );
    }
  }

  private async fetchData(
    name: string,
    data: Record<string, any>,
    include: string,
  ): Promise<Record<string, any>> {
    const handler = camelCase('include ' + name);
    let includeFunc;
    if (this[handler]) {
      includeFunc = this[handler](data, {
        includes: include.substr(include.indexOf('.')).replace(/./g, ','),
      });
    }
    return await includeFunc;
  }
}
