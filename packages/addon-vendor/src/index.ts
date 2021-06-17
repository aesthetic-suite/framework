/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { VendorPrefixer } from '@aesthetic/types';
import { prefix } from './prefix';
import { prefixSelector } from './prefixSelector';

const prefixer: VendorPrefixer = {
	prefix,
	prefixSelector,
};

export default prefixer;
