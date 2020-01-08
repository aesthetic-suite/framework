import deepMerge from 'extend';
import {
  DesignTokens,
  ThemeTokens,
  ThemeConfig,
  ColorScheme,
  DeepPartial,
  PaletteConfigStates,
  ColorConfig,
  ColorShade,
  ContrastLevel,
} from './types';

// TODO mixins

export default class Theme<ColorNames extends string> {
  readonly contrast: ContrastLevel;

  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  private readonly config: ThemeConfig<ColorNames>;

  constructor(config: ThemeConfig<ColorNames>, tokens: DesignTokens) {
    this.config = config;
    this.contrast = config.contrast;
    this.scheme = config.scheme;
    this.tokens = {
      ...tokens,
      palette: this.compilePalettes(),
    };
  }

  /**
   * Extend the current theme to create a new theme,
   * with the ability to override individual configuration settings.
   */
  extend(config: DeepPartial<ThemeConfig<ColorNames>>): Theme<ColorNames> {
    return new Theme(deepMerge(true, {}, this.config, config), this.tokens);
  }

  protected compilePalettes(): ThemeConfig<ColorNames>['palettes'] {
    const { palettes } = this.config;
    const tokens: Partial<ThemeConfig<ColorNames>['palettes']> = {};

    Object.entries(palettes).forEach(([name, config]) => {
      tokens[name as keyof typeof tokens] = {
        bg: this.compilePaletteState(config.bg),
        fg: this.compilePaletteState(config.fg),
      };
    });

    return tokens as ThemeConfig<ColorNames>['palettes'];
  }

  protected compilePaletteState(state: PaletteConfigStates): PaletteConfigStates {
    const token: Partial<PaletteConfigStates> = {};

    Object.entries(state).forEach(([key, value]) => {
      const path = String(value);
      let hex = '';

      if (path.includes('.')) {
        const [hue, shade] = path.split('.') as [ColorNames, ColorShade];

        hex = (this.config.colors[hue] as ColorConfig)[shade];
      } else {
        hex = this.config.colors[path as ColorNames] as string;
      }

      token[key as keyof typeof token] = hex;
    });

    return token as PaletteConfigStates;
  }
}
