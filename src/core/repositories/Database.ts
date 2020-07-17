import { isEmpty } from 'lodash';
import { ModelNotFoundException } from '../exceptions';
import { RepositoryContract } from './Contract';
export class DatabaseRepository implements RepositoryContract {
  entity = null;

  /**
   * Get all rows
   */
  async all(): Promise<Array<Record<string, any>> | []> {
    return await this.query().find();
  }

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  async firstWhere(
    inputs?: Record<string, any>,
    error = true,
  ): Promise<Record<string, any> | null> {
    inputs = inputs || {};
    const query = this.query();
    const model = await query.findOne(inputs);
    if (error && isEmpty(model)) {
      this.raiseError();
    }

    return model;
  }

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  async getWhere(
    inputs: Record<string, any>,
    error?: boolean,
  ): Promise<Array<Record<string, any>> | []> {
    return [];
  }

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  async create(inputs: Record<string, any>): Promise<Record<string, any>> {
    return await this.query().insert(inputs);
  }

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  async createOrUpdate(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>> {
    return {};
  }

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  async firstOrNew(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>> {
    const model = await this.firstWhere(conditions, false);
    if (model) return model;
    return await this.create({ ...conditions, ...values });
  }

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  async update(
    model: any,
    setValues: Record<string, any>,
  ): Promise<number | null> {
    return null;
  }

  /**
   * Update all models where condition is matched
   * @param column
   * @param value
   * @param setValues
   */
  async updateWhere(
    where: Record<string, any>,
    setValues: Record<string, any>,
  ): Promise<number | null> {
    return null;
  }

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  async count(params): Promise<number> {
    return 1;
  }

  /**
   * Delete a model
   *
   * @param model
   */
  async delete(model): Promise<boolean> {
    return true;
  }

  /**
   * Delete documents where query is matched.
   *
   * @param params
   */
  async deleteWhere(params): Promise<boolean> {
    return true;
  }

  /**
   * Refresh a model
   *
   * @param model
   */
  async refresh(model): Promise<Record<string, any> | null> {
    return model;
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
  query() {
    return this.entity;
  }

  getEntityName(): string {
    return this.entity.metadata.name;
  }
}
