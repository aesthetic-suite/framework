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
import formatFontFace from './unified/formatFontFace';
import injectFontFaces from './unified/injectFontFaces';
import injectKeyframes from './unified/injectKeyframes';
import joinProperties from './unified/joinProperties';

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
