/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic from './Aesthetic';
import LocalSheet from './LocalSheet';

const aesthetic = new Aesthetic();

export const { createLocalStyles, getTheme, registerTheme } = aesthetic;

export * from './types';

export { LocalSheet };
