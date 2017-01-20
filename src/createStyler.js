/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';
import style from './style';

import type { StyleDeclarationOrCallback, HOCOptions } from './types';

export default function createStyler(aesthetic: Aesthetic) {
  if (__DEV__) {
    if (!(aesthetic instanceof Aesthetic)) {
      throw new TypeError('An instance of `Aesthetic` must be provided.');
    }
  }

  return function styler(defaultStyles: StyleDeclarationOrCallback = {}, options: HOCOptions = {}) {
    return style(aesthetic, defaultStyles, options);
  };
}
