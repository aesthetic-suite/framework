/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Transformer from '../Transformer';

import type { StyleDeclarationMap, ClassNameMap } from '../types';

export default class ClassNameTransformer extends Transformer {
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    Object.keys(declarations).forEach((setName) => {
      if (typeof declarations[setName] !== 'string') {
        throw new TypeError('Only CSS class names can be used for styling.');
      }
    });

    return declarations;
  }
}
