export interface RepositoryContract<T> {
  model: any;

  /**
   * Get all rows
   */
  all(inputs?: T): Promise<T[]>;

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  firstWhere(inputs: T, error?: boolean): Promise<T | null>;

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  getWhere(inputs: T, error?: boolean): Promise<T[]>;

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  create(inputs: T): Promise<T>;

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  createOrUpdate(conditions: T, values: T): Promise<T>;

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  firstOrNew(conditions: T, values: T): Promise<T>;

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  update(model: any, setValues: T): Promise<number | null>;

  /**
   * Update all models where condition is matched
   * @param column
   * @param value
   * @param setValues
   */
  updateWhere(where: T, setValues: T): Promise<number | null>;

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  exists(params: T): Promise<boolean>;

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  count(params: T): Promise<number>;

  /**
   * Refresh a model
   *
   * @param model
   */
  refresh(model): Promise<T | null>;

  /**
   * Delete a model
   *
   * @param model
   */
  delete(model): Promise<boolean>;

  /**
   * Delete documents where query is matched.
   *
   * @param params
   */
  deleteWhere(params): Promise<boolean>;

  /**
   * Relate ids to a model
   * @param model
   * @param relation
   * @param payload
   */
  attach(
    model: T,
    relation: string,
    payload: number | string | Array<number | string> | Record<string, any>,
  ): Promise<void>;

  /**
   * Sync relation with a model
   * @param model
   * @param relation
   * @param payload
   */
  sync(model: T, relation: string, payload): Promise<void>;

  /**
   * Fetch a chunk and run callback
   */
  chunk(where: Record<string, any>, size: number, cb: Function): Promise<void>;

  /**
   * Throws model not found exception.
   *
   * @throws ModelNotFoundException
   */
  raiseError(): void;

  /**
   * Returns new Query Builder Instance
   */
  query(): any;
}
