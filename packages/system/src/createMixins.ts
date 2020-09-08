import mixins from './mixins';
import { Mixins, VarUtil } from './types';

export default function createMixins(vars: VarUtil): Mixins {
  return {
    border: {
      sm: mixins.border(vars, 'sm'),
      df: mixins.border(vars, 'df'),
      lg: mixins.border(vars, 'lg'),
    },
    box: {
      sm: mixins.box(vars, 'sm'),
      df: mixins.box(vars, 'df'),
      lg: mixins.box(vars, 'lg'),
    },
    heading: {
      l1: mixins.heading(vars, 'l1'),
      l2: mixins.heading(vars, 'l2'),
      l3: mixins.heading(vars, 'l3'),
      l4: mixins.heading(vars, 'l4'),
      l5: mixins.heading(vars, 'l5'),
      l6: mixins.heading(vars, 'l6'),
    },
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
    shadow: {
      xs: mixins.shadow(vars, 'xs'),
      sm: mixins.shadow(vars, 'sm'),
      md: mixins.shadow(vars, 'md'),
      lg: mixins.shadow(vars, 'lg'),
      xl: mixins.shadow(vars, 'xl'),
    },
    text: {
      sm: mixins.text(vars, 'sm'),
      df: mixins.text(vars, 'df'),
      lg: mixins.text(vars, 'lg'),
    },
  };
}
