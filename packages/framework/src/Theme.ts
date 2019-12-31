import { DesignTokens, ThemeTokens, ThemeConfig, ColorScheme, DeepPartial } from './types';
import { validateThemeConfig } from './validate';

export default class Theme {
  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  protected readonly config: ThemeConfig;

  constructor(config: ThemeConfig, tokens: DesignTokens) {
    this.config = validateThemeConfig(config);
    this.scheme = config.scheme;
    this.tokens = {
      ...tokens,
      palette: this.compilePalettes(),
    };
  }

  extend(config: DeepPartial<ThemeConfig>): Theme {
    return new Theme();
  }

  protected compilePalettes(): ThemeConfig['palettes'] {}
}
