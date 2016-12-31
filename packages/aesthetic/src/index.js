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
import classNames from './classNames';

const ClassNamesShape = PropTypes.objectOf(PropTypes.string);

export { createStyler, classNames, Adapter, ClassNameAdapter, ThemeProvider, ClassNamesShape };
export default Aesthetic;
