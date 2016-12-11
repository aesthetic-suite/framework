/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { ComponentDeclarations, ClassNames } from './types';

export default class Adapter {
  /**
   * Transform the style objects into a mapping of CSS class names.
   */
  transform(styleName: string, declarations: ComponentDeclarations): ClassNames {
    return {};
  }
}
