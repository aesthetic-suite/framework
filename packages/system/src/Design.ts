import deepMerge from 'extend';
import { DesignTokens, DeepPartial, ThemeOptions, ThemeTokens } from './types';
import Theme from './Theme';

export default class Design {
  readonly tokens: DesignTokens;

  constructor(tokens: DesignTokens) {
    this.tokens = tokens;
  }

  createTheme(options: ThemeOptions, tokens: ThemeTokens): Theme {
    return new Theme(options, {
      ...this.tokens,
      ...tokens,
    });
  }

  extend(tokens: DeepPartial<DesignTokens>): Design {
    return new Design(deepMerge(true, {}, this.tokens, tokens));
  }
}
