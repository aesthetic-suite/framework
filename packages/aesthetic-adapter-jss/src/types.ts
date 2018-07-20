/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { FontFace } from 'aesthetic';
import { Style } from 'jss/css';

export type Declaration = Style;

// https://github.com/cssinjs/jss/blob/master/packages/jss/src/plugins/rules.js
export type AtRules = {
  '@charset'?: string;
  '@font-face'?: FontFace | FontFace[];
  '@import'?: string | string[];
  '@namespace'?: string;
  '@viewport'?: Declaration;
};

export type StyleSheet = AtRules & { [selector: string]: string | Declaration };
