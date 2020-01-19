import deepMerge from 'extend';
import Theme from './Theme';
import { LAYERS } from './constants';
import { DesignTokens, DeepPartial, ThemeOptions, ThemeTokens } from './types';

export default class Design {
  readonly tokens: DesignTokens;

  constructor(tokens: Omit<DesignTokens, 'layers' | 'unit'>) {
    this.tokens = {
      ...tokens,
      layer: LAYERS,
      // TODO
      unit: () => '',
    };
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
}
