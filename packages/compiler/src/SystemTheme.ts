import deepMerge from 'extend';
import { camelCase } from 'lodash';
import { ColorScheme, ContrastLevel, DeepPartial, Hexcode, ColorShade } from '@aesthetic/system';
import { ThemeConfig, ThemeTemplate, PaletteConfig, PaletteTemplate, PaletteState } from './types';
import { formatShade } from './helpers';

export default class SystemTheme<ColorNames extends string = string> {
  contrast: ContrastLevel;

  extendedFrom: string;

  name: string;

  scheme: ColorScheme;

  template: ThemeTemplate;

  private readonly config: ThemeConfig<ColorNames>;

  constructor(name: string, config: ThemeConfig<ColorNames>, extendedFrom: string = '') {
    this.name = camelCase(name);
    this.config = config;
    this.contrast = config.contrast;
    this.scheme = config.scheme;
    this.template = {
      palette: this.compilePalettes(),
    };
    this.extendedFrom = camelCase(extendedFrom);
  }

  extend(
    name: string,
    config: DeepPartial<ThemeConfig<ColorNames>>,
    extendedFrom: string,
  ): SystemTheme<ColorNames> {
    return new SystemTheme(name, deepMerge(true, {}, this.config, config), extendedFrom);
  }

  protected getColorHexcode(color: string, shade: ColorShade): Hexcode {
    return this.config.colors[color as ColorNames][shade];
  }

  protected compilePalettes(): ThemeTemplate['palette'] {
    const { palettes } = this.config;
    const tokens: Partial<ThemeTemplate['palette']> = {};

    Object.entries(palettes).forEach(([name, config]) => {
      tokens[name as keyof typeof palettes] = this.compilePalette(config);
    });

    return tokens as ThemeTemplate['palette'];
  }

  protected compilePalette(config: string | PaletteConfig): PaletteTemplate {
    const bg: Partial<PaletteState> = {};
    const fg: Partial<PaletteState> = {};
    let color = '';

    if (typeof config === 'string') {
      color = config;
    } else {
      color = config.color;
      Object.assign(bg, config.bg);
      Object.assign(fg, config.fg);
    }

    return {
      color: this.config.colors[color as ColorNames],
      bg: this.compilePaletteState(color, bg),
      fg: this.compilePaletteState(color, fg),
    };
  }

  protected compilePaletteState(
    color: string,
    state: Partial<PaletteState>,
  ): PaletteState<Hexcode> {
    return {
      base: this.getColorHexcode(color, formatShade(state.base ?? 40)),
      disabled: this.getColorHexcode(color, formatShade(state.disabled ?? 30)),
      focused: this.getColorHexcode(color, formatShade(state.focused ?? 50)),
      hovered: this.getColorHexcode(color, formatShade(state.hovered ?? 60)),
      selected: this.getColorHexcode(color, formatShade(state.selected ?? 50)),
    };
  }
}
