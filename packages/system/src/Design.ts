import deepMerge from 'extend';
import Theme from './Theme';
import { DEPTHS } from './constants';
import { DesignTokens, DeepPartial, ThemeOptions, ThemeTokens, Unit } from './types';

export default class Design {
  readonly rootLineHeight: number;

  readonly rootTextSize: number;

  readonly spacingUnit: number;

  readonly tokens: DesignTokens;

  constructor(tokens: Omit<DesignTokens, 'elevation' | 'unit'>) {
    this.tokens = {
      ...tokens,
      elevation: DEPTHS,
      unit: this.unit,
    };

    this.rootLineHeight = tokens.typography.rootLineHeight;
    this.rootTextSize = parseFloat(tokens.typography.rootTextSize);
    this.spacingUnit =
      tokens.spacing.type === 'vertical-rhythm'
        ? this.rootTextSize * this.rootLineHeight
        : tokens.spacing.unit;
  }

  /**
   * Create a new theme with the defined tokens, while inheriting the shared design tokens.
   */
  createTheme(options: ThemeOptions, tokens: ThemeTokens): Theme {
    return new Theme(options, {
      ...this.tokens,
      ...tokens,
    });
  }

  /**
   * Extend and instantiate a new design instance with customized design tokens.
   */
  extend(tokens: DeepPartial<DesignTokens>): Design {
    return new Design(deepMerge(true, {}, this.tokens, tokens));
  }

  /**
   * Return a `rem` unit equivalent for the current spacing type and unit.
   */
  unit = (...multipliers: number[]): Unit => {
    return multipliers
      .map(m => `${((this.spacingUnit * m) / this.rootTextSize).toFixed(2).replace('.00', '')}rem`)
      .join(' ');
  };
}
