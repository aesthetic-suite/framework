/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { StyleDeclarationMap, ClassNameMap } from './types';

export default class Transformer {
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    return {};
  }

  purge(styleName: string) {}
}
