/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { ClassName } from 'aesthetic';
import { SimpleStyle } from 'jss/css'; // eslint-disable-line import/no-unresolved

export type NativeBlock = SimpleStyle & {
  fallbacks?: any;
};

export type ParsedBlock = ClassName;
