import fs from 'fs';
import yaml from 'js-yaml';
import { Path } from '@boost/common';
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
  ColorStates,
  ShadowScaledConfig,
  ShadowSizedConfig,
  ShadowConfig,
} from './types';
import { font } from './helpers';
import { SCALES, DEFAULT_BREAKPOINTS, DEFAULT_UNIT, PLATFORM_CONFIGS } from './constants';

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

export default class ConfigLoader {
  platform: PlatformType;

  constructor(platform: PlatformType) {
    this.platform = platform;
  }

  async load(path: Path): Promise<ConfigFile> {
    const data = await fs.promises.readFile(path.path(), 'utf8');
    const yml = yaml.safeLoad(data);

    return this.validate(yml);
  }

  validate(config: DeepPartial<ConfigFile>): ConfigFile {
    return optimal(config, {
      borders: this.borders(),
      colors: this.colors(),
      responsive: this.responsive(),
      shadows: this.shadows(),
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

  protected colorMap() {
    return union([string(), this.colorState()], '');
  }

  protected colorState() {
    const color = () => string().custom(this.validatePaletteColorReference);

    return shape<ColorStates>({
      base: color().required(),
      disabled: color(),
      focused: color(),
      hovered: color(),
      selected: color(),
    })
      .exact()
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
      textScale: scale('minor-second'),
      lineHeightScale: scale('minor-second'),
    }).exact();
  }

  protected shadows() {
    const shadowScaled = shape<ShadowScaledConfig>({
      blur: unit(2),
      blurScale: scale(1.75),
      spread: unit(0),
      spreadScale: scale(0),
      x: unit(0),
      xScale: scale(0),
      y: unit(1),
      yScale: scale('golden-ratio'),
    }).exact();

    const shadowSizes = shape<ShadowSizedConfig>({
      xsmall: shape({
        blur: unit(2),
        spread: unit(0),
        x: unit(0),
        y: unit(1),
      }).exact(),
      small: shape({
        blur: unit(3.5),
        spread: unit(0),
        x: unit(0),
        y: unit(1.6),
      }).exact(),
      medium: shape({
        blur: unit(6),
        spread: unit(0),
        x: unit(0),
        y: unit(2.6),
      }).exact(),
      large: shape({
        blur: unit(10),
        spread: unit(0),
        x: unit(0),
        y: unit(4.25),
      }).exact(),
      xlarge: shape({
        blur: unit(18),
        spread: unit(0),
        x: unit(0),
        y: unit(6.85),
      }).exact(),
    }).exact();

    return union<ShadowConfig>([shadowScaled, shadowSizes], shadowScaled.default());
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
          primary: this.themePalette(),
          secondary: this.themePalette(),
          success: this.themePalette(),
          tertiary: this.themePalette(),
          warning: this.themePalette(),
        })
          .exact()
          .required(),
        scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
        ui: shape({
          border: this.colorMap(),
          box: this.colorMap(),
          document: this.colorMap(),
          shadow: this.colorMap(),
          text: this.colorMap(),
        })
          .exact()
          .required(),
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
    return shape({
      bg: this.colorMap(),
      fg: this.colorMap(),
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
    }).exact();

    return union<TypographyConfig['heading']>(
      [headingScaled, headingSizes],
      headingScaled.default(),
    );
  }

  protected typographyText() {
    const defaultSize = PLATFORM_CONFIGS[this.platform].baseFontSize;

    const textScaled = shape<TextScaledConfig>({
      lineHeight: unit(1.25),
      lineHeightScale: scale(0),
      size: unit(14),
      sizeScale: scale('major-second'),
    }).exact();

    const textSizes = shape<TextSizedConfig>({
      small: shape({
        lineHeight: unit(1.25),
        size: unit(defaultSize - 2),
      }).exact(),
      default: shape({
        lineHeight: unit(1.25),
        size: unit(defaultSize),
      }).exact(),
      large: shape({
        lineHeight: unit(1.25),
        size: unit(defaultSize + 2),
      }).exact(),
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
    const themeName = schema.currentPath.split('.')[1];
    const colors = schema.struct.themes?.[themeName]?.colors ?? {};

    if (!ref) {
      return;
    }

    // Hue + shade: black.10
    if (ref.includes('.')) {
      const [hue, shade] = ref.split('.') as [string, ColorShade];
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
