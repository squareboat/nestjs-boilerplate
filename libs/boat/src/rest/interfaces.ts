import { Request as BaseRequest } from 'express';
import { Response as BaseResponse } from 'express';
import { CustomHeaders } from '../interfaces';

export interface Request extends BaseRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  getContext(): Request;

  /**
   * Get the current user from the request object
   */
  user: Record<string, any>;
  /**
   * Get the current country from the request object
   */
  countryInfo: Record<string, any>;
  isFallback: boolean;
  devicehash: string;
  clientIp: string;
  client(): CustomHeaders;
}

export interface Response extends BaseResponse {
  success(
    data: Record<string, any> | Array<any> | string,
    message?: string,
    status?: number | string,
  ): any;

  error(error: Record<string, any> | string, status?: number | string): any;

  noContent(): any;

  withMeta(data: Record<string, any>, status?: number | string): any;
}

export interface ServerOptions {
  addValidationContainer?: boolean;
  port?: number;
  globalPrefix?: string;
}
