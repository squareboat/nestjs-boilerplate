export class EventMetadata {
  private static store: Record<string, any> = { events: {}, listeners: {} };

  static addListener(event: string, target: Function): void {
    const listeners = EventMetadata.store.listeners[event] || [];
    listeners.push(target);
    EventMetadata.store.listeners[event] = listeners;
  }

  static getListeners(event: string): Function[] {
    const listeners = EventMetadata.store.listeners[event];
    return listeners || [];
  }
}
