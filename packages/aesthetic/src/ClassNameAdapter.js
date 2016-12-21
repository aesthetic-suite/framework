/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class ClassNameAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      const classNames = {};

      Object.keys(declarations).forEach((setName: string) => {
        if (typeof declarations[setName] === 'string') {
          classNames[setName] = declarations[setName];
        } else {
          throw new TypeError(
            '`ClassNameAdapter` expects valid CSS class names; ' +
            `non-string provided for "${setName}".`,
          );
        }
      });

      this.sheets[styleName] = sheet = {
        sheet: {},
        classNames,
      };
    }

    return { ...sheet.classNames };
  }
}
