/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { StyleDeclarationMap, TransformedStylesMap } from './types';

export default class Adapter {
  native: boolean = false;

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
