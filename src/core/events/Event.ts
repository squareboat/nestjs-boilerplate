import { isEmpty } from 'lodash';
import 'reflect-metadata';
import { EVENT_EMITTER_NAME } from './constants';
import { EventMetadata } from './EventMetadata';

export abstract class EmitsEvent {
  private data: any;

  public getData(): any {
    return this.data;
  }

  async emit(data: any): Promise<void> {
    const event = Reflect.getMetadata(EVENT_EMITTER_NAME, this.constructor);
    if (!event) return;
    const listeners = EventMetadata.getListeners(event);
    if (isEmpty(listeners)) return;
    this.data = data;

    for (const listener of listeners) {
      listener(this);
    }

    return;
  }
}
