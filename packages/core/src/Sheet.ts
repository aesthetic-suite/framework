import { Renderer } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import { SheetParams } from './types';

export default abstract class Sheet<T> {
  protected renderedQueries: { [key: string]: T } = {};

  /**
   * Factory and render the style sheet to the document.
   */
  render(renderer: Renderer, theme: Theme, baseParams: SheetParams): T {
    const params: Required<SheetParams> = {
      contrast: theme.contrast,
      direction: 'ltr',
      prefix: false,
      scheme: theme.scheme,
      theme: theme.name,
      unit: 'px',
      ...baseParams,
    };
    const key = JSON.stringify(params);
    const cache = this.renderedQueries[key];

    if (cache) {
      return cache;
    }

    const result = this.doRender(renderer, theme, params);

    this.renderedQueries[key] = result;

    return result;
  }

  /**
   * Validate the factory is a function.
   */
  protected validateFactory<F>(factory: F): F {
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
  protected abstract doRender(renderer: Renderer, theme: Theme, params: Required<SheetParams>): T;
}
