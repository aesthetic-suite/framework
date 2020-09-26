import { EventType, OnChangeDirection, OnChangeTheme } from './types';

export const listeners = new Map<EventType, Set<(...args: unknown[]) => void>>();

/**
 * Return a set of listeners, or create it if it does not exist.
 */
function getListeners<T extends Function>(type: EventType): Set<T> {
  const set = listeners.get(type) || new Set();

  listeners.set(type, set);

  return (set as unknown) as Set<T>;
}

/**
 * Subscribe and listen to an event by name.
 */
export function subscribe(type: 'change:direction', listener: OnChangeDirection): () => void;
export function subscribe(type: 'change:theme', listener: OnChangeTheme): () => void;
export function subscribe(type: EventType, listener: Function): () => void {
  getListeners(type).add(listener);

  return () => {
    unsubscribe(type as 'change:theme', listener as OnChangeTheme);
  };
}

/**
 * Unsubscribe from an event by name.
 */
export function unsubscribe(type: 'change:direction', listener: OnChangeDirection): void;
export function unsubscribe(type: 'change:theme', listener: OnChangeTheme): void;
export function unsubscribe(type: EventType, listener: Function) {
  getListeners(type).delete(listener);
}

/**
 * Emit all listeners by type, with the defined arguments.
 */
export function emit(type: 'change:direction', args: Parameters<OnChangeDirection>): void;
export function emit(type: 'change:theme', args: Parameters<OnChangeTheme>): void;
export function emit(type: EventType, args: unknown[]): void {
  getListeners(type).forEach((listener) => {
    listener(...args);
  });
}
