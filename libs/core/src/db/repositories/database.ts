import { RepositoryContract } from './contract';
import { BaseModel } from '../baseModel';
import { CustomQueryBuilder } from '../queryBuilder';
import { isEmpty } from 'lodash';
import { ModelNotFoundException } from '../../exceptions';

export class DatabaseRepository<T extends Record<string, any>>
  implements RepositoryContract<T>
{
  model: any;

  setModel(model: BaseModel): this {
    this.model = model;
    return this;
  }

  /**
   * Get all rows
   */
  async all(): Promise<T[]> {
    return await this.query();
  }

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  async firstWhere(inputs: T, error = true): Promise<T> {
    // inputs = inputs || {};
    const query = this.query();
    const model = await query.findOne(inputs);

    if (error && isEmpty(model)) this.raiseError();

    return model;
  }

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  async getWhere(inputs: T, error = true): Promise<T[]> {
    const query = this.query();

    for (const key in inputs) {
      Array.isArray(inputs[key])
        ? query.whereIn(key, inputs[key])
        : query.where(key, inputs[key]);
    }
    const models = await query;
    if (error && isEmpty(models)) this.raiseError();

    return models;
  }

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  async create(inputs: T): Promise<T> {
    return this.query().insert(inputs).returning('*') as unknown as T;
  }

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  async createOrUpdate(conditions: T, values: T): Promise<T> {
    const model = await this.firstWhere(conditions, false);
    if (!model) {
      return this.create({ ...conditions, ...values });
    }

    await this.update(model, values);
    return await this.refresh(model);
  }

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  async firstOrNew(conditions: T, values: T): Promise<T> {
    const model = await this.firstWhere(conditions, false);
    if (model) return model;
    return await this.create({ ...conditions, ...values });
  }

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  async update(model: T, setValues: T): Promise<number | null> {
    const query = this.query();
    query.findById(model.id).patch(setValues);
    return await query;
  }

  /**
   * Update all models where condition is matched
   * @param where
   * @param setValues
   */
  async updateWhere(where: T, setValues: T): Promise<number | null> {
    const query = this.query();
    query.where(where).patch(setValues);
    return await query;
  }

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  async exists(params: T): Promise<boolean> {
    const query = this.query();
    query.where(params);
    return !!(await query.onlyCount());
  }

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  async count(params: T): Promise<number> {
    const query = this.query();
    query.where(params);
    return await query.onlyCount();
  }

  /**
   * Delete a model
   *
   * @param model
   */
  async delete(model: T | number): Promise<boolean> {
    return !!+(await this.query().deleteById(
      typeof model != 'object' ? model : model.id,
    ));
  }

  /**
   * Delete documents where query is matched.
   *
   * @param params
   */
  async deleteWhere(params: T): Promise<boolean> {
    const query = this.query();
    for (const key in params) {
      Array.isArray(params[key])
        ? query.whereIn(key, params[key])
        : query.where(key, params[key]);
    }
    return !!+(await query.delete());
  }

  /**
   * Refresh a model
   *
   * @param model
   */
  async refresh(model: T): Promise<T | null> {
    return model ? await this.query().findById(model.id) : null;
  }

  /**
   * Relate ids to a model
   * @param model
   * @param relation
   * @param payload
   */
  async attach(model: T, relation: string, payload): Promise<void> {
    await model.$relatedQuery(relation).relate(payload);
    return;
  }

  /**
   * Sync relation with a model
   * @param model
   * @param relation
   * @param payload
   */
  async sync(model: T, relation: string, payload): Promise<void> {
    await model.$relatedQuery(relation).unrelate();
    await model.$relatedQuery(relation).relate(payload);
    return;
  }

  /**
   * Fetch a chunk and run callback
   */
  async chunk(where: T, size: number, cb: Function): Promise<void> {
    const query = this.query();
    query.where(where);
    await query.chunk(cb, size);
    return;
  }

  /**
   * Throws model not found exception.
   *
   * @throws ModelNotFoundException
   */
  raiseError(): void {
    throw new ModelNotFoundException(this.getEntityName() + ' not found');
  }

  /**
   * Returns new Query Builder Instance
   */
  query(): CustomQueryBuilder<any, any> {
    return this.model.query();
  }

  getEntityName(): string {
    return this.model.name;
  }
}
