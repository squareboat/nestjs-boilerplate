import { pick } from 'lodash';
import { Model } from 'objection';
import { LoadRelSchema } from '../interfaces';
import { CustomQueryBuilder } from './queryBuilder';

export class BaseModel extends Model {
  readonly id: number;

  QueryBuilderType!: CustomQueryBuilder<this>;
  static QueryBuilder = CustomQueryBuilder;
  static useLimitInFirst = true;

  async $forceLoad(expression: LoadRelSchema, options = {}): Promise<void> {
    await this.$fetchGraph(expression, options);
  }

  async $load(expression: LoadRelSchema, options = {}): Promise<void> {
    const getKeys = (obj: Record<string, any>): Array<Record<string, any>> => {
      const p = [];
      for (const key in obj) {
        const o = { parent: key, children: [] };
        if (key === '$recursive' || key === '$relation' || key === '$modify') {
          continue;
        }
        const exp = obj[key];
        if (typeof exp === 'object') {
          o.children = getKeys(exp);
        }
        p.push(o);
      }

      return p;
    };

    const p = getKeys(expression);

    const toBeLoadedRelations = {};
    const getUnloadedRelationsList = async (
      model: BaseModel,
      rel: Array<any>,
      parent: string,
    ) => {
      for (const o of rel) {
        if (!model || !model[o.parent]) {
          toBeLoadedRelations[
            parent !== '' ? `${parent}.${o.parent}` : o.parent
          ] = true;
        }

        if (o.children.length > 0) {
          getUnloadedRelationsList(model[o.parent], o.children, o.parent);
        }
      }
    };

    await getUnloadedRelationsList(this, p, '');
    const promises = [];
    const alreadyLoading = [];
    for (const key in toBeLoadedRelations) {
      const [parent, children] = key.split('.');

      if (!alreadyLoading.includes(parent)) {
        promises.push(this.$fetchGraph(pick(expression, parent)));
        alreadyLoading.push(parent);
      }
    }

    await Promise.all(promises);

    return;
  }
}
