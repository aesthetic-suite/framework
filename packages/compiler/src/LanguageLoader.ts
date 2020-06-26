import { Path } from '@boost/common';
import { DeepPartial } from '@aesthetic/system';
import optimal, { array, number, object, shape, string, tuple, union } from 'optimal';
import Loader from './Loader';
import {
  SCALES,
  DEFAULT_BREAKPOINTS,
  DEFAULT_UNIT,
  PLATFORM_CONFIGS,
  LANGUAGE_FILE,
} from './constants';
import { getPlatformFont } from './helpers';
import {
  BorderConfig,
  BorderScaledConfig,
  BorderSizedConfig,
  BreakpointConfig,
  BreakpointListConfig,
  BreakpointSizedConfig,
  HeadingScaledConfig,
  HeadingSizedConfig,
  LanguageConfigFile,
  PlatformType,
  ResponsiveConfig,
  Scale,
  ScaleType,
  ShadowConfig,
  ShadowScaledConfig,
  ShadowSizedConfig,
  SpacingConfig,
  SpacingType,
  StrategyType,
  TextScaledConfig,
  TextSizedConfig,
  TypographyConfig,
} from './types';

function scale(defaultValue: Scale) {
  return union<Scale>(
    [number().gte(0), string<ScaleType>().oneOf(Object.keys(SCALES) as ScaleType[])],
    defaultValue,
  );
}

function unit(defaultValue: number = 0) {
  return number(defaultValue);
}

export default class LanguageLoader extends Loader<LanguageConfigFile> {
  platform: PlatformType;

  constructor(platform: PlatformType) {
    super();

    this.platform = platform;
  }

  getFileName() {
    return LANGUAGE_FILE;
  }

  validate(config: DeepPartial<LanguageConfigFile>, filePath: Path): LanguageConfigFile {
    return optimal(
      config,
      {
        borders: this.borders(),
        colors: this.colors(),
        extends: string(),
        responsive: this.responsive(),
        shadows: this.shadows(),
        spacing: this.spacing(),
        typography: this.typography(),
      },
      {
        file: filePath.path(),
      },
    );
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
    return array(string().notEmpty().camelCase()).notEmpty().required();
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
      multipliers: shape<SpacingConfig['multipliers']>({
        xs: number(0.25),
        sm: number(0.5),
        df: number(1),
        md: number(2),
        lg: number(3),
        xl: number(4),
      }),
      type: string('vertical-rhythm').oneOf<SpacingType>(['unit', 'vertical-rhythm']),
      unit: number(DEFAULT_UNIT),
    }).exact();
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
}
