import { GenericFunction } from '../constants';

export interface Pagination<T> {
  data: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
  };
}

export interface SortableSchema {
  sort?: string;
}

export interface ObjectionModel {
  $fetchGraph?: GenericFunction;
  $load?(exp: LoadRelSchema): Promise<void>;
}

export interface NestedLoadRelSchema {
  $recursive?: boolean | number;
  $relation?: string;
  $modify?: string[];
  [key: string]: boolean | number | string | string[] | NestedLoadRelSchema;
}

export interface LoadRelSchema {
  [key: string]: boolean | NestedLoadRelSchema;
}
