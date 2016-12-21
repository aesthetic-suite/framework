/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { PropTypes } from 'react';
import Aesthetic from './Aesthetic';
import Adapter from './Adapter';
import createStyler from './createStyler';
import ThemeProvider from './ThemeProvider';

export const StylesShape = PropTypes.objectOf(PropTypes.string);

export { createStyler, Adapter, ThemeProvider };
export default Aesthetic;
