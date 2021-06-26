import { QueryBuilder, Model, Page, OrderByDirection } from 'objection';
import { cloneDeep, isEmpty } from 'lodash';
import { Pagination } from '../interfaces';

export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
> {
  ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
  NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
  PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;

  async paginate<T>(page: number, perPage: number): Promise<Pagination<T>> {
    page = +page ? +page : 1;
    perPage = +perPage ? +perPage : 15;

    const result = await this.page(page - 1, perPage);
    return {
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(result.total / perPage),
        perPage,
        total: result.total,
      },
      data: result.results as unknown as T[],
    };
  }

  async allPages<T>(): Promise<Pagination<T>> {
    return { data: (await this) as unknown as T[] };
  }

  async onlyCount() {
    const result = await this.count({ c: '*' });
    return +result[0].c;
  }

  async exists() {
    const result = await this.onlyCount();
    return !!result;
  }

  async chunk(cb: Function, size: number): Promise<void> {
    let offset = 0;
    let hasMore = true;
    while (!!!offset || hasMore) {
      const query = cloneDeep(this);
      const records = await query.offset(offset).limit(size);
      hasMore = !isEmpty(records);
      if (!hasMore) return;
      await cb(records);
      offset += size;
    }
  }

  cOrderBy(expressions: String): this {
    const orders = (expressions || '').split('|');
    for (const order of orders) {
      const [column, direction] = order.split(':');
      if (!column) continue;
      this.orderBy(column, (direction || 'ASC') as OrderByDirection);
    }

    return this;
  }
}
