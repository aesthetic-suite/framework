/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { StyleDeclarationMap, ClassNameMap } from 'aesthetic';

export default class GlamorAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      const value = declarations[setName];

      if (typeof value === 'string') {
        classNames[setName] = value;
      } else {
        classNames[setName] = `${styleName}-${String(css(value))}`;
      }
    });

    return classNames;
  }
}
