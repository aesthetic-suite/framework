import { DesignTokens, ThemeTokens, ThemeConfig, ColorScheme, DeepPartial } from './types';
import { validateThemeConfig } from './validate';

export default class Theme<ColorNames extends string> {
  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  protected readonly config: ThemeConfig<ColorNames>;

  constructor(config: ThemeConfig<ColorNames>, tokens: DesignTokens, colors: ColorNames[]) {
    this.config = validateThemeConfig(config, colors);
    this.scheme = config.scheme;
    this.tokens = {
      ...tokens,
      palette: this.compilePalettes(),
    };
  }

  extend(config: DeepPartial<ThemeConfig<ColorNames>>): Theme<ColorNames> {
    return new Theme();
  }

  protected compilePalettes(): ThemeConfig<ColorNames>['palettes'] {}
}
