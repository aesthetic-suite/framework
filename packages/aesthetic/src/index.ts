/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import PropTypes from 'prop-types';
import Aesthetic from './Aesthetic';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import ThemeContext from './ThemeContext';
import formatFontFace from './unified/formatFontFace';
import injectFontFaces from './unified/injectFontFaces';
import injectKeyframes from './unified/injectKeyframes';

export const StylesPropType = PropTypes.objectOf(PropTypes.object);

export {
  Adapter,
  ClassNameAdapter,
  ThemeContext,
  formatFontFace,
  injectFontFaces,
  injectKeyframes,
};

export * from './types';

export default Aesthetic;
