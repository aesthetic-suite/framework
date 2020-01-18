import { border } from './border';
import { box } from './box';
import { heading } from './heading';
import {
  hidden,
  hiddenOffscreen,
  resetButton,
  resetInput,
  resetList,
  resetTypography,
} from './pattern';
import { text } from './text';
import { breakWord, root, truncate, wrapWord } from './typography';

export default {
  border,
  box,
  heading,
  hidden,
  hiddenOffscreen,
  resetButton,
  resetInput,
  resetList,
  resetTypography,
  text,
  typographyBreak: breakWord,
  typographyRoot: root,
  typographyTruncate: truncate,
  typographyWrap: wrapWord,
};
