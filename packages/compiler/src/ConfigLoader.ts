import { Path, parseFile } from '@boost/common';
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
  ShadowScaledConfig,
  ShadowSizedConfig,
  ShadowConfig,
  PaletteConfig,
  PaletteState,
  PalettesConfig,
} from './types';
import { SCALES, DEFAULT_BREAKPOINTS, DEFAULT_UNIT, PLATFORM_CONFIGS } from './constants';
import { getPlatformFont } from './helpers';

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

  load(path: Path): ConfigFile {
    return this.validate(parseFile(path));
  }

  validate(config: DeepPartial<ConfigFile>): ConfigFile {
    return optimal(config, {
      name: this.name(),
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

  protected colorShade(defaultValue: number) {
    return number(defaultValue).oneOf([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  }

  protected name() {
    return string().notEmpty();
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
        palettes: shape<PalettesConfig>({
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
      shape<ColorConfig>({
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
    )
      .custom(this.validateThemeImplementsColors)
      .required();
  }

  protected themePaletteState(base: number) {
    return shape<PaletteState>({
      base: this.colorShade(base),
      disabled: this.colorShade(base - 10),
      focused: this.colorShade(base + 10),
      hovered: this.colorShade(base + 20),
      selected: this.colorShade(base + 10),
    })
      .exact()
      .required();
  }

  protected themePalette() {
    const color = string()
      .required()
      .notEmpty()
      .custom(this.validatePaletteColorReference);

    return union<string | PaletteConfig>(
      [
        color,
        shape<PaletteConfig>({
          color,
          bg: this.themePaletteState(40),
          fg: this.themePaletteState(50),
        })
          .exact()
          .required(),
      ],
      '',
    );
  }

  protected typography() {
    return shape<TypographyConfig>({
      font: union<TypographyConfig['font']>(
        [
          string(),
          shape({
            text: string('system'),
            heading: string('system'),
            monospace: string(() => getPlatformFont(this.platform, 'monospace')),
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

  protected validatePaletteColorReference = (name: string, schema: Schema<ConfigFile>) => {
    const names = new Set<string>(schema.struct.colors);

    if (!names.has(name)) {
      throw new Error(`Invalid color "${name}".`);
    }
  };
}
