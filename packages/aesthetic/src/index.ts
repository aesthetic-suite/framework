/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions } from './Aesthetic';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import ThemeContext from './ThemeContext';
import UnifiedSyntax from './UnifiedSyntax';
import { WithStylesProps, WithStylesWrapperProps, WithStylesOptions } from './withStyles';
import Ruleset from './syntax/Ruleset';
import StyleSheet from './syntax/StyleSheet';
import formatFontFace from './syntax/formatFontFace';
import injectFontFaces from './syntax/injectFontFaces';
import injectKeyframes from './syntax/injectKeyframes';
import joinProperties from './syntax/joinProperties';

export {
  AestheticOptions,
  Adapter,
  ClassNameAdapter,
  ThemeContext,
  UnifiedSyntax,
  WithStylesProps,
  WithStylesWrapperProps,
  WithStylesOptions,
  Ruleset,
  StyleSheet,
  formatFontFace,
  injectFontFaces,
  injectKeyframes,
  joinProperties,
};

export * from './types';

export default Aesthetic;
