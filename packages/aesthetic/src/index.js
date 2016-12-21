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

const StylesShape = PropTypes.objectOf(PropTypes.string);

export { createStyler, Adapter, ClassNameAdapter, ThemeProvider, StylesShape };
export default Aesthetic;
