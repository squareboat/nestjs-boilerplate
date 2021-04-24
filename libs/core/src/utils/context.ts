import { Request } from '../http';

export class Context {
  req: Request;

  setRequest(req: Request): this {
    this.req = req;
    return this;
  }

  getRequest(): Request {
    return this.req;
  }
}
