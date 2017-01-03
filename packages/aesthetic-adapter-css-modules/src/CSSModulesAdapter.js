/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class CSSModulesAdapter extends Adapter {
  unifiedSyntax: boolean = false;

  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = `${styleName}-${String(declarations[setName])}`;
    });

    return classNames;
  }
}
