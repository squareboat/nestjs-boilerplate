import 'reflect-metadata';
import { EVENT_EMITTER_NAME, EVENT_NAME } from './constants';

export function Event(name: string) {
  return function(target: Function) {
    Reflect.defineMetadata(EVENT_EMITTER_NAME, name, target);
  };
}

export function EventListener(event: string) {
  return function(
    target: Record<string, any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(EVENT_NAME, event, target, propertyKey);
  };
}
