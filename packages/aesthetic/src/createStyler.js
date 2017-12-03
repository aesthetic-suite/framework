/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';
import style from './style';

import type {
  HOCComponent,
  HOCOptions,
  HOCWrappedComponent,
  StyleCallback,
  StyleDeclarations,
} from '../../types';

export default function createStyler(aesthetic: Aesthetic): * {
  if (__DEV__) {
    if (!(aesthetic instanceof Aesthetic)) {
      throw new TypeError('An instance of `Aesthetic` must be provided.');
    }
  }

  return function styler(
    defaultStyles?: StyleCallback | StyleDeclarations = {},
    options?: HOCOptions = {},
  ): (HOCWrappedComponent) => HOCComponent {
    return style(aesthetic, defaultStyles, options);
  };
}
