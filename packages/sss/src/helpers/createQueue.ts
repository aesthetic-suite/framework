import { ParserOptions } from '../types';

export type QueueItem = (...args: unknown[]) => void;

export default function createQueue(options: ParserOptions<object>) {
  const items: QueueItem[] = [];

  return {
    add<T extends object, K extends keyof T>(obj: T, key: K, callback: (...args: any[]) => void) {
      const value = obj[key];

      if (value !== undefined) {
        items.push(() => callback(value, options));

        // @ts-expect-error
        obj[key] = undefined;
      }
    },
    process() {
      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < items.length; i += 1) {
        items[i]();
      }
    },
  };
}
