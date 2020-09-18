import { arrayLoop } from '@aesthetic/utils';
import { Events } from '../types';

export type QueueItem = (...args: unknown[]) => void;

export default function createQueue(events: Events<object>) {
  const items: QueueItem[] = [];

  return {
    add<T extends object, K extends keyof T>(obj: T, key: K, callback: (...args: any[]) => void) {
      const value = obj[key];

      if (value !== undefined) {
        items.push(() => callback(value, events));
      }

      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    },
    process() {
      arrayLoop(items, (cb) => cb());
    },
  };
}
