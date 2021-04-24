export interface RepositoryContract {
  model: any;

  /**
   * Get all rows
   */
  all(inputs?: Record<string, any>): Promise<Array<Record<string, any>>>;

  /**
   * Get first instance with the matching criterias
   * @param inputs
   * @param error
   */
  firstWhere<T>(
    inputs: Record<string, any>,
    error?: boolean,
  ): Promise<T | null>;

  /**
   * Get all instances with the matching criterias
   * @param inputs
   * @param error
   */
  getWhere(
    inputs: Record<string, any>,
    error?: boolean,
  ): Promise<Array<Record<string, any>> | []>;

  /**
   * Create a new model with given inputs
   * @param inputs
   */
  create<T>(inputs: Record<string, any>): Promise<T>;

  /**
   * Update or Create model with given condition and values
   * @param conditions
   * @param values
   */
  createOrUpdate(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>>;

  /**
   * First or Create model with given condition and values
   *
   * @param conditions
   * @param values
   */
  firstOrNew(
    conditions: Record<string, any>,
    values: Record<string, any>,
  ): Promise<Record<string, any>>;

  /**
   * Update the given model with values
   * @param model
   * @param setValues
   */
  update(model: any, setValues: Record<string, any>): Promise<number | null>;

  /**
   * Update all models where condition is matched
   * @param column
   * @param value
   * @param setValues
   */
  updateWhere(
    where: Record<string, any>,
    setValues: Record<string, any>,
  ): Promise<number | null>;

  /**
   * Check if any model exists where condition is matched
   * @param params
   */
  exists(params: Record<string, any>): Promise<boolean>;

  /**
   * Get count of rows matching a criteria
   * @param params
   */
  count(params: Record<string, any>): Promise<number>;

  /**
   * Refresh a model
   *
   * @param model
   */
  refresh(model): Promise<Record<string, any> | null>;

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
    model,
    relation,
    payload: number | string | Array<number | string> | Record<string, any>,
  ): Promise<void>;

  /**
   * Sync relation with a model
   * @param model
   * @param relation
   * @param payload
   */
  sync(model, relation: string, payload): Promise<void>;

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
