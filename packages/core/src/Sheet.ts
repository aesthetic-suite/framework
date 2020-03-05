import { Renderer, ClassName } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import { SheetQuery } from './types';

export default abstract class Sheet {
  protected renderedClassName?: string;

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
  abstract compose(query: SheetQuery): unknown;

  /**
   * Factory and render the style sheet to the document.
   */
  abstract render(renderer: Renderer, theme: Theme): ClassName;
}
