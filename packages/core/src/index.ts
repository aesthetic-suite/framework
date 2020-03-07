/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic from './Aesthetic';
import GlobalSheet from './GlobalSheet';
import LocalSheet from './LocalSheet';
import Sheet from './Sheet';

export const aesthetic = new Aesthetic();
export const {
  changeTheme,
  createComponentStyles,
  createThemeStyles,
  getActiveTheme,
  getTheme,
  registerDefaultTheme,
  registerTheme,
  renderComponentStyles,
  renderFontFace,
  renderImport,
  renderKeyframes,
} = aesthetic;

export * from '@aesthetic/sss';
export * from '@aesthetic/system';
export * from './types';

export { GlobalSheet, LocalSheet, Sheet };
