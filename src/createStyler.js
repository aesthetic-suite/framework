/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Aesthetic from './Aesthetic';
import style from './style';

import type {
  ComponentDeclarations,
  HOCOptions,
} from './types';

export default function createStyler(aesthetic: Aesthetic) {
  if (!(aesthetic instanceof Aesthetic)) {
    throw new Error('An instance of `Aesthetic` must be provided.');
  }

  return (defaultStyles: ComponentDeclarations = {}, options: HOCOptions = {}) => (
    style(aesthetic, defaultStyles, options)
  );
}
