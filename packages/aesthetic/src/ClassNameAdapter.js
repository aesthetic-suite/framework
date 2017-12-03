/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { TransformedDeclarations } from '../../types';

export default class ClassNameAdapter extends Adapter {
  unifiedSyntax: boolean = false;

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    const classNames = {};

    Object.keys(declarations).forEach((selector: string) => {
      if (typeof declarations[selector] === 'string') {
        classNames[selector] = declarations[selector];
      } else if (__DEV__) {
        throw new TypeError(
          '`ClassNameAdapter` expects valid CSS class names; ' +
          `non-string provided for "${selector}".`,
        );
      }
    });

    return classNames;
  }
}
