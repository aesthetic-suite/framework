/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import PropTypes from 'prop-types';
import Aesthetic from './Aesthetic';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import ThemeProvider from './ThemeProvider';
import createStyler from './createStyler';
import classes from './classes';

export const ClassNamesPropType = PropTypes.objectOf(PropTypes.string);
export const StylesPropType = PropTypes.objectOf(PropTypes.object);
export const ClassOrStylesPropType = PropTypes.oneOfType([
  PropTypes.objectOf(PropTypes.string),
  PropTypes.objectOf(PropTypes.object),
]);

export { Adapter, ClassNameAdapter, ThemeProvider, createStyler, classes };
export default Aesthetic;
