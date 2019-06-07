/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Aesthetic, { AestheticOptions } from './Aesthetic';
import ClassNameAesthetic from './ClassNameAesthetic';
import UnifiedSyntax from './UnifiedSyntax';
import Ruleset from './Ruleset';
import Sheet from './Sheet';
import getFlushedStyles from './helpers/getFlushedStyles';
import getStyleElements from './helpers/getStyleElements';
import purgeStyles from './helpers/purgeStyles';

export * from './types';

export {
  AestheticOptions,
  ClassNameAesthetic,
  UnifiedSyntax,
  Ruleset,
  Sheet,
  getFlushedStyles,
  getStyleElements,
  purgeStyles,
};

export default Aesthetic;
