import { LocalBlock } from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import { objectLoop } from '@aesthetic/utils';

export function root(this: Utilities<LocalBlock>): LocalBlock {
  const declaration: LocalBlock = {
    backgroundColor: this.var('palette-neutral-color-00'),
    color: this.var('palette-neutral-fg-base'),
    fontFamily: this.var('typography-font-text'),
    fontSize: this.var('typography-root-text-size'),
    lineHeight: this.var('typography-root-line-height'),
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
    margin: 0,
    padding: 0,
    // @ts-expect-error
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    '@media': {},
  };

  // Fluid typography!
  objectLoop(this.tokens.breakpoint, (bp, size) => {
    declaration['@media']![bp.query] = {
      fontSize: this.var(`breakpoint-${size}-root-text-size` as 'breakpoint-md-root-text-size'),
      lineHeight: this.var(
        `breakpoint-${size}-root-line-height` as 'breakpoint-md-root-line-height',
      ),
    };
  });

  return declaration;
}
