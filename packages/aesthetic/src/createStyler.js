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
  StatementCallback,
  StyleDeclaration,
  Statement,
} from '../../types';

export default function createStyler(aesthetic: Aesthetic): {
  style: (statement: Statement | StatementCallback, options?: HOCOptions) => HOCWrapper,
  transform: (...styles: StyleDeclaration[]) => ClassName,
} {
  if (__DEV__) {
    if (!(aesthetic instanceof Aesthetic)) {
      throw new TypeError('An instance of `Aesthetic` must be provided.');
    }
  }

  return {
    style(statement: Statement | StatementCallback, options?: HOCOptions = {}): HOCWrapper {
      return aesthetic.withStyles(statement, options);
    },
    transform(...styles: StyleDeclaration[]): ClassName {
      return aesthetic.transformStyles(styles);
    },
  };
}
