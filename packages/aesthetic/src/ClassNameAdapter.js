/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { StyleDeclarationMap, TransformedStylesMap } from '../../types';

export default class ClassNameAdapter extends Adapter {
  unifiedSyntax: boolean = false;

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      if (typeof declarations[setName] === 'string') {
        classNames[setName] = declarations[setName];
      } else if (process.env.NODE_ENV === 'development') {
        throw new TypeError(
          '`ClassNameAdapter` expects valid CSS class names; ' +
          `non-string provided for "${setName}".`,
        );
      }
    });

    return classNames;
  }
}
