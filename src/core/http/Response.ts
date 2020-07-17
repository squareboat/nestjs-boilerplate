import { Response as BaseResponse } from 'express';

export interface Response extends BaseResponse {
  success(
    data: Record<string, any> | Array<any> | string,
    status?: number | string,
  ): any;

  error(error: Record<string, any> | string, status?: number | string): any;

  noContent(): any;

  withMeta(data: Record<string, any>, status?: number | string): any;
}
