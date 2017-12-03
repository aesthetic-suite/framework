/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { TransformedDeclarations } from '../../types';

export default class Adapter<T: Object = {}> {
  bypassNativeStyleSheet: boolean = false;

  native: boolean = false;

  options: T;

  constructor(options?: T) {
    this.options = { ...options };
  }

  /**
   * Transform the unified or native syntax using the registered adapter.
   */
  transform<S: Object>(styleName: string, declarations: S): TransformedDeclarations {
    throw new Error(`${this.constructor.name} must define the \`transform\` method.`);
  }
}
