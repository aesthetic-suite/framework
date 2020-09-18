import { Rule } from '@aesthetic/types';
import { Utilities, BREAKPOINT_SIZES } from '@aesthetic/system';

export function root(this: Utilities): Rule {
  const declaration: Rule = {
    backgroundColor: this.var('palette-neutral-color-00'),
    color: this.var('palette-neutral-fg-base'),
    fontFamily: this.var('typography-font-text'),
    fontSize: this.var('typography-root-text-size'),
    lineHeight: this.var('typography-root-line-height'),
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
    margin: 0,
    padding: 0,
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  };

  // Fluid typography!
  BREAKPOINT_SIZES.forEach((size) => {
    declaration[`@media ${this.token(`breakpoint-${size}-query` as 'breakpoint-md-query')}`] = {
      fontSize: this.var(`breakpoint-${size}-root-text-size` as 'breakpoint-md-root-text-size'),
      lineHeight: this.var(
        `breakpoint-${size}-root-line-height` as 'breakpoint-md-root-line-height',
      ),
    };
  });

  return declaration;
}
