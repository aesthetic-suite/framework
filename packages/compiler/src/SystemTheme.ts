import { camelCase, kebabCase } from 'lodash';
import { deepMerge } from '@aesthetic/utils';
import { ColorScheme, ContrastLevel } from '@aesthetic/types';
import { DeepPartial, Hexcode } from '@aesthetic/system';
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
  INHERIT_SETTING,
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

  protected compilePalette(config: ColorName | PaletteConfig): PaletteTemplate {
    let color = '';
    let text = '';
    let bg: PaletteConfig['bg'] = '';
    let fg: PaletteConfig['fg'] = '';

    if (typeof config === 'string') {
      color = config;
      text = config;
      bg = config;
      fg = config;
    } else {
      ({ color, text, bg, fg } = config);
    }

    return {
      color: this.config.colors[color as ColorNames],
      text: this.getHexcodeByRef(text === INHERIT_SETTING ? color : text, SHADE_TEXT),
      bg: this.compilePaletteState(bg === INHERIT_SETTING ? color : bg),
      fg: this.compilePaletteState(fg === INHERIT_SETTING ? 'white' : fg),
    };
  }

  protected compilePaletteState(
    config: ColorName | PaletteState<ColorShadeRef>,
  ): PaletteState<Hexcode> {
    let base = '';
    let focused = '';
    let hovered = '';
    let selected = '';
    let disabled = '';

    if (typeof config === 'string') {
      base = config;
      focused = config;
      hovered = config;
      selected = config;
      disabled = config;
    } else {
      ({ base, focused, hovered, selected, disabled } = config);
    }

    return {
      base: this.getHexcodeByRef(base, SHADE_BASE),
      focused: this.getHexcodeByRef(focused, SHADE_FOCUSED),
      hovered: this.getHexcodeByRef(hovered, SHADE_HOVERED),
      selected: this.getHexcodeByRef(selected, SHADE_SELECTED),
      disabled: this.getHexcodeByRef(disabled, SHADE_DISABLED),
    };
  }
}
