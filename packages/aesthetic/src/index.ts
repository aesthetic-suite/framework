/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions } from './Aesthetic';
import ClassNameAesthetic from './ClassNameAesthetic';
import ThemeContext from './ThemeContext';
import UnifiedSyntax from './UnifiedSyntax';
import Ruleset from './syntax/Ruleset';
import Sheet from './syntax/Sheet';
import formatFontFace from './syntax/formatFontFace';
import injectFontFaces from './syntax/injectFontFaces';
import injectKeyframes from './syntax/injectKeyframes';
import joinProperties from './syntax/joinProperties';

export {
  AestheticOptions,
  ClassNameAesthetic,
  ThemeContext,
  UnifiedSyntax,
  Ruleset,
  Sheet,
  formatFontFace,
  injectFontFaces,
  injectKeyframes,
  joinProperties,
};

export * from './types';

export default Aesthetic;
