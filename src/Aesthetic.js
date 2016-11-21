/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type {
  CSSStyle,
  StyleDeclaration,
  StyleDeclarationMap,
  StyleTransformer,
} from './types';

export class Aesthetic {
  styles: { [key: string]: StyleDeclarationMap };
  transformer: ?StyleTransformer;

  constructor() {
    this.styles = {};
    this.transformer = null;
  }

  /**
   * Execute the defined transformer with the passed CSS declaration.
   *
   * @param {Object} declaration
   * @param {String} themeName
   * @returns {String|Object}
   */
  executeTransformer(declaration: CSSStyle, themeName: string = ''): StyleDeclaration {
    const transformer = this.transformer;

    if (typeof transformer !== 'function') {
      throw new TypeError('Transformer has not been defined.');
    }

    const output = transformer(declaration);

    if (typeof output !== 'string' && typeof output !== 'object') {
      throw new TypeError(
        'Transformer must return a string, the CSS class name, ' +
        'or an object, for inline styles.',
      );
    }

    return output;
  }

  /**
   * Return a set of transformed style declarations for a component.
   *
   * @param {String} styleName
   * @param {String} themeName
   * @returns {Object}
   */
  getStyles(styleName: string, themeName: string = ''): StyleDeclarationMap {
    if (!this.styles[styleName]) {
      throw new Error(`Styles do not exist for ${styleName}.`);
    }

    const declarations = {};

    Object.keys(this.styles[styleName]).forEach((setName) => {
      declarations[setName] = this.transform(declarations[setName], themeName);
    });

    return declarations;
  }

  /**
   * Set multiple style declarations for a component, while applying transformers.
   *
   * @param {String} styleName
   * @param {Object} declarations
   */
  setStyles(styleName: string, declarations: StyleDeclarationMap) {
    if (!this.styles[styleName]) {
      this.styles[styleName] = {};
    }

    this.styles[styleName] = declarations;
  }

  /**
   * Define a function to transform CSS style objects.
   *
   * @param {Function} transformer
   */
  setTransformer(transformer: StyleTransformer) {
    if (typeof transformer !== 'function') {
      throw new TypeError('Transformer must be a function.');
    }

    this.transformer = transformer;
  }

  /**
   * Transform a style object, or an array of style objects.
   * If the declaration is already a string, we can assume it's a CSS class name.
   *
   * @param {String|Object|Object[]} declaration
   * @param {String} themeName
   * @returns {String|Object}
   */
  transform(declaration: StyleDeclaration, themeName: string = ''): StyleDeclaration {
    switch (typeof declaration) {
      // Already a class name
      case 'string':
        return declaration;

      // Convert style object to class name
      case 'object':
        return this.executeTransformer(declaration, themeName);

      default:
        throw new Error('Transformer not defined.');
    }
  }
}

export default new Aesthetic();
