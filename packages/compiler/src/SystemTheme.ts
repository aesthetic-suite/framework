import deepMerge from 'extend';
import { camelCase } from 'lodash';
import { ColorScheme, ContrastLevel, DeepPartial } from '@aesthetic/system';
import { ThemeConfig, ColorStates, ColorConfig, ColorShade, ThemeTemplate } from './types';

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
      ui: this.compileUI(),
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

  protected getColorHexcode(ref: string): string {
    let hex = '';

    if (ref.includes('.')) {
      const [hue, shade] = ref.split('.') as [ColorNames, ColorShade];

      hex = (this.config.colors[hue] as ColorConfig)[shade];
    } else {
      hex = String(this.config.colors[ref as ColorNames]);
    }

    return hex;
  }

  // eslint-disable-next-line complexity
  protected compileColorState(state: string | ColorStates): ColorStates {
    const base = this.getColorHexcode(typeof state === 'string' ? state : state.base);
    let disabled = '';
    let focused = '';
    let hovered = '';
    let selected = '';

    if (typeof state !== 'string') {
      disabled = state.disabled ? this.getColorHexcode(state.disabled) : '';
      focused = state.focused ? this.getColorHexcode(state.focused) : '';
      hovered = state.hovered ? this.getColorHexcode(state.hovered) : '';
      selected = state.selected ? this.getColorHexcode(state.selected) : '';
    }

    // With shades
    if (base.includes('.')) {
      const [hue, baseShade] = base.split('.');
      const shade = Number(baseShade);

      disabled = disabled || this.getColorHexcode(`${hue}.${Math.min(shade - 10, 0) || '00'}`);
      focused = focused || this.getColorHexcode(`${hue}.${Math.max(shade + 10, 90)}`);
      hovered = hovered || this.getColorHexcode(`${hue}.${Math.max(shade + 20, 90)}`);
      selected = selected || this.getColorHexcode(`${hue}.${Math.max(shade + 20, 90)}`);

      // No shades
    } else {
      disabled = disabled || base;
      focused = focused || base;
      hovered = hovered || base;
      selected = selected || base;
    }

    return { base, disabled, focused, hovered, selected };
  }

  protected compilePalettes(): ThemeTemplate['palette'] {
    const { palettes } = this.config;
    const tokens: Partial<ThemeTemplate['palette']> = {};

    Object.entries(palettes).forEach(([name, config]) => {
      tokens[name as keyof typeof palettes] = {
        bg: this.compileColorState(config.bg),
        fg: this.compileColorState(config.fg),
      };
    });

    return tokens as ThemeTemplate['palette'];
  }

  protected compileUI(): ThemeTemplate['ui'] {
    const { ui } = this.config;
    const tokens: Partial<ThemeTemplate['ui']> = {};

    Object.entries(ui).forEach(([name, config]) => {
      tokens[name as keyof typeof ui] = this.compileColorState(config);
    });

    return tokens as ThemeTemplate['ui'];
  }
}
