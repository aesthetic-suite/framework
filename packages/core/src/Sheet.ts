import { Renderer } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import { SheetParams } from './types';

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

  /**
   * Compose multiple style sheet factories into a single factory.
   */
  abstract compose(params: SheetParams): unknown;

  /**
   * Factory and render the style sheet to the document.
   */
  abstract render(renderer: Renderer, theme: Theme, params: SheetParams): unknown;
}
