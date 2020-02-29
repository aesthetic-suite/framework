/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Design, Theme } from '@aesthetic/system';
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
} = aesthetic;

export * from './types';

export { Design, GlobalSheet, LocalSheet, Sheet, Theme };
