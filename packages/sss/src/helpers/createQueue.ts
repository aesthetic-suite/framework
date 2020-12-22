import { arrayLoop } from '@aesthetic/utils';
import { ParserOptions } from '../types';

export type QueueItem = (...args: unknown[]) => void;

export default function createQueue(options: ParserOptions<object>) {
  const items: QueueItem[] = [];

  return {
    add<T extends object, K extends keyof T>(obj: T, key: K, callback: (...args: any[]) => void) {
      const value = obj[key];

      if (value !== undefined) {
        items.push(() => callback(value, options));
      }

      delete obj[key];
    },
    process() {
      arrayLoop(items, (cb) => cb());
    },
  };
}
