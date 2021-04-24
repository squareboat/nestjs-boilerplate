import { ROUTE_NAME } from './constants';
import 'reflect-metadata';

export function WithAlias(name: string) {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(ROUTE_NAME, name, target, propertyKey);
  };
}
