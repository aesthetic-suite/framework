import { camelCase, kebabCase } from 'lodash';
import { deepMerge } from '@aesthetic/utils';
import { ColorScheme, ContrastLevel, DeepPartial, Hexcode } from '@aesthetic/system';
import {
  ThemeConfig,
  ThemeTemplate,
  PaletteConfig,
  PaletteTemplate,
  PaletteState,
  ColorName,
  ColorShadeRef,
} from './types';
import {
  SHADE_TEXT,
  SHADE_BASE,
  SHADE_FOCUSED,
  SHADE_HOVERED,
  SHADE_SELECTED,
  SHADE_DISABLED,
} from './constants';
import { formatShade } from './helpers';

export default class SystemTheme<ColorNames extends string = string> {
  contrast: ContrastLevel;

  dashedName: string;

  extendedFrom: string;

  name: string;

  scheme: ColorScheme;

  template: ThemeTemplate;

  private readonly config: ThemeConfig<ColorNames>;

  constructor(name: string, config: ThemeConfig<ColorNames>, extendedFrom: string = '') {
    this.name = camelCase(name);
    this.dashedName = kebabCase(name);
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
    return new SystemTheme(name, deepMerge(this.config, config), extendedFrom);
  }

  protected getHexcode(color: string, shade: string | number): Hexcode {
    return this.config.colors[color as ColorNames][formatShade(shade)];
  }

  protected getHexcodeByRef(ref: ColorShadeRef, defaultShade: number = 40): Hexcode {
    const [color, shade] = ref.split('.');

    return this.getHexcode(color, shade || defaultShade);
  }

  protected compilePalettes(): ThemeTemplate['palette'] {
    const { palettes } = this.config;
    const tokens: Partial<ThemeTemplate['palette']> = {};

    Object.entries(palettes).forEach(([name, config]) => {
      tokens[name as keyof typeof palettes] = this.compilePalette(config);
    });

    return tokens as ThemeTemplate['palette'];
  }

  protected compilePalette({ text, bg, fg }: PaletteConfig): PaletteTemplate {
    return {
      text: this.getHexcodeByRef(text, SHADE_TEXT),
      bg: this.compilePaletteState(bg),
      fg: this.compilePaletteState(fg),
    };
  }

  protected compilePaletteState(
    config: ColorName | PaletteState<ColorShadeRef>,
  ): PaletteState<Hexcode> {
    if (typeof config === 'string') {
      return {
        base: this.getHexcode(config, SHADE_BASE),
        focused: this.getHexcode(config, SHADE_FOCUSED),
        hovered: this.getHexcode(config, SHADE_HOVERED),
        selected: this.getHexcode(config, SHADE_SELECTED),
        disabled: this.getHexcode(config, SHADE_DISABLED),
      };
    }

    return {
      base: this.getHexcodeByRef(config.base, SHADE_BASE),
      focused: this.getHexcodeByRef(config.focused, SHADE_FOCUSED),
      hovered: this.getHexcodeByRef(config.hovered, SHADE_HOVERED),
      selected: this.getHexcodeByRef(config.selected, SHADE_SELECTED),
      disabled: this.getHexcodeByRef(config.disabled, SHADE_DISABLED),
    };
  }
}
