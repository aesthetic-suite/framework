import optimal, { object, shape, string, union, ObjectOf, Schema } from 'optimal';
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
import { hexcode } from './validate';

// TODO mixins

export default class Theme<ColorNames extends string> {
  readonly contrast: ContrastLevel;

  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  private readonly colorNames: ColorNames[];

  private readonly config: ThemeConfig<ColorNames>;

  constructor(config: ThemeConfig<ColorNames>, tokens: DesignTokens, colorNames: ColorNames[]) {
    this.colorNames = colorNames;
    this.config = this.validateConfig(config);
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
    return new Theme(deepMerge(true, {}, this.config, config), this.tokens, this.colorNames);
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

  protected createPaletteBlueprint() {
    const color = () => string().custom(this.validateColorReference);

    const state = () =>
      shape({
        base: color().required(),
        disabled: color(),
        focused: color(),
        hovered: color(),
        selected: color(),
      })
        .exact()
        .required();

    return shape({
      bg: state(),
      fg: state(),
    })
      .exact()
      .required();
  }

  protected validateConfig = (config: ThemeConfig<ColorNames>) => {
    return optimal(config, {
      colors: object<string | ColorConfig, ColorNames>(
        union(
          [
            hexcode(),
            shape({
              '00': hexcode(),
              '10': hexcode(),
              '20': hexcode(),
              '30': hexcode(),
              '40': hexcode(),
              '50': hexcode(),
              '60': hexcode(),
              '70': hexcode(),
              '80': hexcode(),
              '90': hexcode(),
            })
              .exact()
              .required(),
          ],
          '',
        ),
      )
        .custom(this.validateColorNames)
        .required(),
      contrast: string('none').oneOf<ContrastLevel>(['normal', 'high', 'low']),
      palettes: shape({
        danger: this.createPaletteBlueprint(),
        info: this.createPaletteBlueprint(),
        muted: this.createPaletteBlueprint(),
        neutral: this.createPaletteBlueprint(),
        primary: this.createPaletteBlueprint(),
        secondary: this.createPaletteBlueprint(),
        success: this.createPaletteBlueprint(),
        tertiary: this.createPaletteBlueprint(),
        warning: this.createPaletteBlueprint(),
      })
        .exact()
        .required(),
      scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
    });
  };

  protected validateColorNames = (colors: ObjectOf<string | ColorConfig>) => {
    if (__DEV__) {
      const names = new Set<string>(this.colorNames);
      const unknown = new Set<string>();

      Object.keys(colors).forEach(color => {
        if (names.has(color)) {
          names.delete(color);
        } else {
          unknown.add(color);
        }
      });

      if (names.size > 0) {
        throw new Error(
          `Theme has not implemented the following colors: ${Array.from(names).join(', ')}`,
        );
      }

      if (unknown.size > 0) {
        throw new Error(`Theme is using unknown colors: ${Array.from(unknown).join(', ')}`);
      }
    }
  };

  protected validateColorReference = (ref: string, schema: Schema<ThemeConfig<ColorNames>>) => {
    if (__DEV__) {
      const colors = schema.struct.colors!;

      if (!ref) {
        return;
      }

      // Hue + shade: black.10
      if (ref.includes('.')) {
        const [hue, shade] = ref.split('.') as [ColorNames, ColorShade];
        const config: string | ColorConfig = colors[hue];

        if (typeof config === 'string') {
          throw new TypeError(
            `Invalid color reference, "${ref}" is pointing to a shade, but the color does not use shades.`,
          );
        } else if (!config || !config[shade]) {
          throw new Error(`Invalid color reference, "${ref}" does not exist.`);
        }

        return;
      }

      // Hue w/ no shade: black
      const config: string | ColorConfig = colors[ref as ColorNames];

      if (config && typeof config !== 'string') {
        throw new Error(
          `Invalid color reference, "${ref}" is pointing to shadeless color, but the color is using shades.`,
        );
      } else if (!config) {
        throw new Error(`Invalid color reference, "${ref}" does not exist.`);
      }
    }
  };
}
