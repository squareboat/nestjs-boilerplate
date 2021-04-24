import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { get, omit } from 'lodash';

@Injectable()
export class RequestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.bindRequestHelpers(context.switchToHttp().getRequest());
    this.bindResponseHelpers(context.switchToHttp().getResponse());

    return true;
  }

  /**
   * Bind Response Helpers
   *
   * @param response
   */
  bindResponseHelpers(response: any): any {
    const success = function (
      data: Record<string, any> | Array<any> | string,
      status = 200,
    ) {
      return response.status(status).json({
        success: true,
        code: status,
        data: data,
      });
    };

    const error = function (error: Record<string, any> | string, status = 401) {
      let message = 'Something went wrong!';
      let errors = null;
      if (error instanceof Object) {
        message = error.message;
        errors = error.errors;
      } else {
        message = error;
      }

      return response.status(status).json({
        success: false,
        code: status,
        message: message,
        errors: errors,
      });
    };

    const noContent = function () {
      return response.status(204).end();
    };

    const withMeta = function (data: Record<string, any>, status = 200) {
      return response.status(status).json({
        success: true,
        code: status,
        data: get(data, 'data'),
        meta: omit(data, ['data']),
      });
    };

    response.success = success;
    response.error = error;
    response.noContent = noContent;
    response.withMeta = withMeta;

    return response;
  }

  /**
   * Bind Request Helpers
   *
   * @param request
   */
  bindRequestHelpers(request: any): any {
    const all = function (): Record<string, any> {
      const inputs = { ...request.query, ...request.body, ...request.params };

      for (const key in inputs) {
        const value = inputs[key];
        if (typeof value === 'string' || value instanceof String) {
          inputs[key] = value.trim();
        }
      }

      return inputs;
    };

    request.all = all;
    return request;
  }
}
