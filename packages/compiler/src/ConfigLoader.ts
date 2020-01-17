import fs from 'fs';
import yaml from 'js-yaml';
import { DeepPartial, ColorScheme, ContrastLevel, Hexcode } from '@aesthetic/system';
import optimal, {
  array,
  number,
  object,
  ObjectOf,
  Schema,
  shape,
  string,
  tuple,
  union,
} from 'optimal';
import {
  BorderConfig,
  BorderScaledConfig,
  BorderSizedConfig,
  BreakpointConfig,
  BreakpointListConfig,
  BreakpointSizedConfig,
  ColorConfig,
  ColorShade,
  ConfigFile,
  HeadingScaledConfig,
  HeadingSizedConfig,
  PlatformType,
  ResponsiveConfig,
  Scale,
  ScaleType,
  SpacingConfig,
  SpacingType,
  StrategyType,
  TextScaledConfig,
  TextSizedConfig,
  ThemeConfig,
  TypographyConfig,
} from './types';
import { SCALES, DEFAULT_BREAKPOINTS, DEFAULT_UNIT, FONT_FAMILIES } from './constants';

function hexcode() {
  return string()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu)
    .required();
}

function scale(defaultValue: Scale) {
  return union<Scale>(
    [number().gte(0), string<ScaleType>().oneOf(Object.keys(SCALES) as ScaleType[])],
    defaultValue,
  );
}

function unit(defaultValue: number = 0) {
  return number(defaultValue);
}

function font(platform: PlatformType, type: 'monospace' | 'system') {
  return FONT_FAMILIES[`${platform}-${type}` as 'web-system'];
}

export default class ConfigLoader {
  platform: PlatformType;

  constructor(platform: PlatformType) {
    this.platform = platform;
  }

  async load(filePath: string): Promise<ConfigFile> {
    const data = await fs.promises.readFile(filePath, 'utf8');

    return this.validate(yaml.safeLoad(data));
  }

  validate(config: DeepPartial<ConfigFile>): ConfigFile {
    return optimal(config, {
      borders: this.borders(),
      colors: this.colors(),
      responsive: this.responsive(),
      spacing: this.spacing(),
      themes: this.themes(),
      typography: this.typography(),
    });
  }

  protected borders() {
    const borderScaled = shape<BorderScaledConfig>({
      radius: unit(3),
      radiusScale: scale('perfect-fourth'),
      width: unit(1),
      widthScale: scale(0),
    }).exact();

    const borderSizes = shape<BorderSizedConfig>({
      small: shape({
        radius: unit(2),
        width: unit(1),
      }).exact(),
      default: shape({
        radius: unit(3),
        width: unit(1),
      }).exact(),
      large: shape({
        radius: unit(4),
        width: unit(1),
      }).exact(),
    }).exact();

    return union<BorderConfig>([borderScaled, borderSizes], borderScaled.default());
  }

  protected colors() {
    return array(
      string()
        .notEmpty()
        .camelCase(),
    )
      .notEmpty()
      .required();
  }

  protected responsive() {
    const [xs, sm, md, lg, xl] = DEFAULT_BREAKPOINTS;

    return shape<ResponsiveConfig>({
      strategy: string('mobile-first').oneOf<StrategyType>(['desktop-first', 'mobile-first']),
      breakpoints: union<BreakpointConfig>(
        [
          tuple<BreakpointListConfig>([unit(xs), unit(sm), unit(md), unit(lg), unit(xl)]),
          shape<BreakpointSizedConfig>({
            xs: unit(xs),
            sm: unit(sm),
            md: unit(md),
            lg: unit(lg),
            xl: unit(xl),
          }).exact(),
        ],
        DEFAULT_BREAKPOINTS,
      ),
    }).exact();
  }

  protected spacing() {
    return shape<SpacingConfig>({
      type: string('vertical-rhythm').oneOf<SpacingType>(['unit', 'vertical-rhythm']),
      unit: number(DEFAULT_UNIT),
    }).exact();
  }

  protected themes() {
    return object(
      shape<ThemeConfig>({
        colors: this.themeColors(),
        contrast: string('normal').oneOf<ContrastLevel>(['high', 'low', 'normal']),
        extends: string(),
        palettes: shape({
          brand: this.themePalette(),
          danger: this.themePalette(),
          info: this.themePalette(),
          muted: this.themePalette(),
          neutral: this.themePalette(),
          primary: this.themePalette(),
          secondary: this.themePalette(),
          success: this.themePalette(),
          tertiary: this.themePalette(),
          warning: this.themePalette(),
        })
          .exact()
          .required(),
        scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
      }).exact(),
    );
  }

  protected themeColors() {
    return object(
      union<Hexcode | ColorConfig>(
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
          }).exact(),
        ],
        '',
      ),
    )
      .custom(this.validateThemeImplementsColors)
      .required();
  }

  protected themePalette() {
    const color = () => string().custom(this.validatePaletteColorReference);

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

  protected typography() {
    return shape<TypographyConfig>({
      font: union<TypographyConfig['font']>(
        [
          string(),
          shape({
            text: string('system'),
            heading: string('system'),
            monospace: string(() => font(this.platform, 'monospace')),
            locale: object(string()),
          }).exact(),
        ],
        'system',
      ),
      text: this.typographyText(),
      heading: this.typographyHeading(),
    }).exact();
  }

  protected typographyHeading() {
    const headingScaled = shape<HeadingScaledConfig>({
      letterSpacing: unit(0.25),
      letterSpacingScale: scale('perfect-fourth'),
      lineHeight: unit(1.5),
      lineHeightScale: scale('major-second'),
      responsiveScale: scale('minor-second'),
      size: unit(16),
      sizeScale: scale('major-third'),
    }).exact();

    const headingSizes = shape<HeadingSizedConfig>({
      level1: shape({
        letterSpacing: unit(1.05),
        lineHeight: unit(2.7),
        size: unit(48),
      }).exact(),
      level2: shape({
        letterSpacing: unit(0.79),
        lineHeight: unit(2.4),
        size: unit(38),
      }).exact(),
      level3: shape({
        letterSpacing: unit(0.59),
        lineHeight: unit(2.14),
        size: unit(32),
      }).exact(),
      level4: shape({
        letterSpacing: unit(0.44),
        lineHeight: unit(1.9),
        size: unit(25),
      }).exact(),
      level5: shape({
        letterSpacing: unit(0.33),
        lineHeight: unit(1.69),
        size: unit(20),
      }).exact(),
      level6: shape({
        letterSpacing: unit(0.25),
        lineHeight: unit(1.5),
        size: unit(16),
      }).exact(),
      responsiveScale: scale('minor-second'),
    }).exact();

    return union<TypographyConfig['heading']>(
      [headingScaled, headingSizes],
      headingScaled.default(),
    );
  }

  protected typographyText() {
    const textScaled = shape<TextScaledConfig>({
      lineHeight: unit(1.25),
      lineHeightScale: scale(0),
      responsiveScale: scale('minor-second'),
      size: unit(14),
      sizeScale: scale('major-second'),
    }).exact();

    const textSizes = shape<TextSizedConfig>({
      small: shape({
        lineHeight: unit(1.25),
        size: unit(12),
      }).exact(),
      default: shape({
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      large: shape({
        lineHeight: unit(1.25),
        size: unit(16),
      }).exact(),
      responsiveScale: scale('minor-second'),
    }).exact();

    return union<TypographyConfig['text']>([textScaled, textSizes], textScaled.default());
  }

  protected validateThemeImplementsColors = (
    colors: ObjectOf<Hexcode | ColorConfig>,
    schema: Schema<ConfigFile>,
  ) => {
    const names = new Set<string>(schema.struct.colors);
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
  };

  protected validatePaletteColorReference = (ref: string, schema: Schema<ConfigFile>) => {
    const colors = schema.struct.colors!;

    if (!ref) {
      return;
    }

    // Hue + shade: black.10
    if (ref.includes('.')) {
      const [hue, shade] = ref.split('.') as [string, ColorShade];
      // @ts-ignore TODO need parent object
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
    // @ts-ignore TODO need parent object
    const config: string | ColorConfig = colors[ref];

    if (config && typeof config !== 'string') {
      throw new Error(
        `Invalid color reference, "${ref}" is pointing to shadeless color, but the color is using shades.`,
      );
    } else if (!config) {
      throw new Error(`Invalid color reference, "${ref}" does not exist.`);
    }
  };
}
