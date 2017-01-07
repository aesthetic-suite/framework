/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { PropTypes } from 'react';
import Aesthetic from './Aesthetic';
import Adapter from './Adapter';
import ClassNameAdapter from './ClassNameAdapter';
import ThemeProvider from './ThemeProvider';
import createStyler from './createStyler';
import classes from './classNames';

export const ClassNamesPropType = PropTypes.objectOf(PropTypes.string);

export { createStyler, classes, Adapter, ClassNameAdapter, ThemeProvider };
export default Aesthetic;
