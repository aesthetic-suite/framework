import deepMerge from 'extend';
import {
  ColorScheme,
  ContrastLevel,
  ThemeOptions,
  Tokens,
  DeepPartial,
  ThemeTokens,
  Mixins,
} from './types';

// TODO mixins

export default class Theme {
  readonly contrast: ContrastLevel;

  readonly mixins: Mixins = {};

  readonly scheme: ColorScheme;

  readonly tokens: Tokens;

  constructor(options: ThemeOptions, tokens: Tokens) {
    this.contrast = options.contrast;
    this.scheme = options.scheme;
    this.tokens = tokens;
  }

  extend(tokens: DeepPartial<ThemeTokens>, options: Partial<ThemeOptions> = {}): Theme {
    return new Theme(
      {
        contrast: this.contrast,
        scheme: this.scheme,
        ...options,
      },
      deepMerge(true, {}, this.tokens, tokens),
    );
  }
}
