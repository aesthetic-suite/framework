import deepMerge from 'extend';
import { ColorScheme, ContrastLevel, DeepPartial } from '@aesthetic/system';
import {
  ThemeConfig,
  ColorStates,
  ColorConfig,
  ColorShade,
  DesignTemplate,
  ThemeTemplate,
} from './types';

// TODO mixins

export default class Theme<ColorNames extends string = string> {
  readonly contrast: ContrastLevel;

  readonly scheme: ColorScheme;

  readonly template: ThemeTemplate;

  private readonly config: ThemeConfig<ColorNames>;

  constructor(config: ThemeConfig<ColorNames>, template: DesignTemplate) {
    this.config = config;
    this.contrast = config.contrast;
    this.scheme = config.scheme;
    this.template = {
      ...template,
      palette: this.compilePalettes(),
    };
  }

  extend(config: DeepPartial<ThemeConfig<ColorNames>>): Theme<ColorNames> {
    return new Theme(deepMerge(true, {}, this.config, config), this.template);
  }

  protected compilePalettes(): ThemeTemplate['palette'] {
    const { palettes } = this.config;
    const tokens: Partial<ThemeTemplate['palette']> = {};

    Object.entries(palettes).forEach(([name, config]) => {
      tokens[name as keyof typeof tokens] = {
        bg: this.compilePaletteState(config.bg),
        fg: this.compilePaletteState(config.fg),
      };
    });

    return tokens as ThemeTemplate['palette'];
  }

  protected compilePaletteState(state: ColorStates): ColorStates {
    const token: Partial<ColorStates> = {};

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

    return token as ColorStates;
  }
}
