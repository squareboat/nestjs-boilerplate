import { QueryBuilder, Model, Page } from 'objection';
import { isNotEmpty, } from '../helpers/Helpers';
import { cloneDeep } from 'lodash';

export class CustomQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
  > {
  ArrayQueryBuilderType!: CustomQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: CustomQueryBuilder<M, M>;
  NumberQueryBuilderType!: CustomQueryBuilder<M, number>;
  PageQueryBuilderType!: CustomQueryBuilder<M, Page<M>>;

  async paginate(page: number, perPage: number) {
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
      data: result.results,
    };
  }

  async onlyCount() {
    const result = await this.count({ c: '*' });
    return result[0].c;
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
      hasMore = isNotEmpty(records);
      if (!hasMore) return;
      await cb(records);
      offset += size;
    }
  }
}
