/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Adapter from './Adapter';

import type { StyleSheet } from '../../types';

export default class ClassNameAdapter extends Adapter {
  unifiedSyntax: boolean = false;

  transform<T: Object>(styleName: string, statement: T): StyleSheet {
    const classNames = {};

    Object.keys(statement).forEach((selector) => {
      if (typeof statement[selector] === 'string') {
        classNames[selector] = statement[selector];
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
