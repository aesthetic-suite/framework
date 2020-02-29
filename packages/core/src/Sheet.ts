import { SheetQuery } from './types';

export default abstract class Sheet {
  protected validateFactory<T>(factory: T): T {
    if (__DEV__) {
      const typeOf = typeof factory;

      if (typeOf !== 'function') {
        throw new TypeError(`A style sheet factory function is required, found "${typeOf}".`);
      }
    }

    return factory;
  }

  abstract compose(query: SheetQuery): unknown;
}
