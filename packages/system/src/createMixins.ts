import { objectCreate } from '@aesthetic/utils';
import mixins from './mixins';
import { Mixins, VarUtil } from './types';
import { BORDER_SIZES, HEADING_SIZES, SHADOW_SIZES, TEXT_SIZES } from './constants';

export default function createMixins(vars: VarUtil): Mixins {
  return {
    border: objectCreate(BORDER_SIZES, (size) => mixins.border(vars, size)),
    box: objectCreate(TEXT_SIZES, (size) => mixins.box(vars, size)),
    heading: objectCreate(HEADING_SIZES, (size) => mixins.heading(vars, size)),
    pattern: {
      hide: {
        completely: mixins.hideCompletely(),
        offscreen: mixins.hideOffscreen(),
        visually: mixins.hideVisually(),
      },
      reset: {
        button: mixins.resetButton(),
        input: mixins.resetInput(),
        list: mixins.resetList(),
        media: mixins.resetMedia(),
        typography: mixins.resetTypography(),
      },
      root: mixins.root(vars),
      text: {
        break: mixins.textBreak(),
        truncate: mixins.textTruncate(),
        wrap: mixins.textWrap(),
      },
    },
    shadow: objectCreate(SHADOW_SIZES, (size) => mixins.shadow(vars, size)),
    text: objectCreate(TEXT_SIZES, (size) => mixins.text(vars, size)),
  };
}
