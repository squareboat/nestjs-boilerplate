export class TransformerContext {
  private context = {};

  /**
   * Add a new key pair value to the transformer's context
   * @param key
   * @param value
   */
  add(
    key: string,
    value: Record<string, any> | Array<any> | number | string | null,
  ): void {
    this.context[key] = value;
  }

  /**
   * Get the value corresponding to the key from the transformer's context
   * @param key
   */
  get(key: string): Record<string, any> | Array<any> | number | string | null {
    return this.context[key];
  }
}
