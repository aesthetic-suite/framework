/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { background } from './background';
import { border } from './border';
import { hideCompletely, hideOffscreen, hideVisually } from './display';
import { foreground } from './foreground';
import { heading } from './heading';
import { resetButton, resetInput, resetList, resetMedia, resetTypography } from './reset';
import { root } from './root';
import { shadow } from './shadow';
import { text, textBreak, textTruncate, textWrap } from './text';
import { uiBox, uiInteractive } from './ui';

export * from './types';

export default {
  background,
  border,
  hideCompletely,
  hideOffscreen,
  hideVisually,
  foreground,
  heading,
  resetButton,
  resetInput,
  resetList,
  resetMedia,
  resetTypography,
  root,
  shadow,
  text,
  textBreak,
  textTruncate,
  textWrap,
  uiBox,
  uiInteractive,
};
