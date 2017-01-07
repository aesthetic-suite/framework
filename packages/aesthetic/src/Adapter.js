/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { StyleDeclarationMap, ClassNameMap } from 'aesthetic';

export default class Adapter {
  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
