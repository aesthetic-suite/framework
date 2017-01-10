/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from '../../Adapter';

import type { StyleDeclarationMap, ClassNameMap } from '../../types';

export default class CSSModulesAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = `${styleName}-${String(declarations[setName])}`;
    });

    return classNames;
  }
}
