/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic from './Aesthetic';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import Sheet from './Sheet';

const aesthetic = new Aesthetic();

export const { createComponentStyles, createThemeStyles, getTheme, registerTheme } = aesthetic;

export * from './types';

export { GlobalSheet, LocalSheet, Sheet };
