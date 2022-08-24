type AppEvent = {
  type: string;
  data: unknown[];
};

export type EventDataByType<
  Event extends AppEvent,
  T extends Event["type"]
> = Event extends { type: T } ? Event["data"] : never;

export class EventEmitter<Event extends AppEvent = AppEvent> {
  private handlers: Map<Event["type"], ((...args: Event["data"]) => void)[]> =
    new Map();

  public addEventListener<T extends Event["type"]>(
    type: T,
    handler: (...args: EventDataByType<Event, T>) => void
  ) {
    const currentListeners = this.handlers.get(type) ?? [];
    this.handlers.set(type, [...currentListeners, handler] as any);
  }

  public removeEventListener<T extends Event["type"]>(
    type: T,
    handler: (...args: EventDataByType<Event, T>) => void
  ) {
    const currentListeners = this.handlers.get(type) ?? [];
    this.handlers.set(
      type,
      currentListeners.filter((l) => l !== handler)
    );
  }

  public emit<T extends Event["type"]>(
    type: T,
    ...args: EventDataByType<Event, T>
  ) {
    const currentListeners = this.handlers.get(type) ?? [];
    currentListeners.forEach((l) => l(...args));
  }
}
