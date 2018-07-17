/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';

import type {
  ClassName,
  HOCOptions,
  HOCWrapper,
  StyleDeclaration,
  StyleSheet,
  StyleSheetCallback,
} from '../../types';

export default function createStyler(
  aesthetic: Aesthetic,
): {
  style: (styleSheet: StyleSheet | StyleSheetCallback, options?: HOCOptions) => HOCWrapper,
  transform: (...styles: StyleDeclaration[]) => ClassName,
} {
  if (__DEV__) {
    if (!(aesthetic instanceof Aesthetic)) {
      throw new TypeError('An instance of `Aesthetic` must be provided.');
    }
  }

  return {
    style(styleSheet: StyleSheet | StyleSheetCallback, options?: HOCOptions = {}): HOCWrapper {
      return aesthetic.withStyles(styleSheet, options);
    },
    transform(...styles: StyleDeclaration[]): ClassName {
      return aesthetic.transformStyles(styles);
    },
  };
}
