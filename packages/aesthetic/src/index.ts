/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import PropTypes from 'prop-types';
import Aesthetic, { AestheticOptions } from './Aesthetic';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import ThemeContext from './ThemeContext';
import UnifiedSyntax from './UnifiedSyntax';
import { WithStylesProps, WithStylesWrapperProps, WithStylesOptions } from './withStyles';
import formatFontFace from './syntax/formatFontFace';
import injectFontFaces from './syntax/injectFontFaces';
import injectKeyframes from './syntax/injectKeyframes';
import joinProperties from './syntax/joinProperties';

export const StylesPropType = PropTypes.objectOf(PropTypes.object);

export {
  AestheticOptions,
  Adapter,
  ClassNameAdapter,
  ThemeContext,
  UnifiedSyntax,
  WithStylesProps,
  WithStylesWrapperProps,
  WithStylesOptions,
  formatFontFace,
  injectFontFaces,
  injectKeyframes,
  joinProperties,
};

export * from './types';

export default Aesthetic;
