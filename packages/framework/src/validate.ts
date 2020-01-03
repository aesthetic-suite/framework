import optimal, { array, number, object, shape, string, tuple, union, ObjectOf } from 'optimal';
import { DEFAULT_BREAKPOINTS, SYSTEM_FONT_FAMILY, SCALES, DEFAULT_UNIT } from './constants';
import {
  ColorConfig,
  ColorScheme,
  DeepPartial,
  DesignConfig,
  Scale,
  ScaleType,
  SpacingType,
  StrategyType,
  ThemeConfig,
} from './types';

function hexcode() {
  return string()
    .required()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu);
}

function scale(defaultValue: Scale = 'major-third') {
  return union<Scale>(
    [number().positive(), string<ScaleType>().oneOf(Object.keys(SCALES) as ScaleType[])],
    defaultValue,
  );
}

function state() {
  return shape({
    base: string(),
    disabled: string(),
    focused: string(),
    hovered: string(),
    selected: string(),
  })
    .exact()
    .required();
}

function unit(defaultValue: number = 0) {
  return number(defaultValue).positive();
}

function palette() {
  return shape({
    bg: state(),
    fg: state(),
  })
    .exact()
    .required();
}

export function validateDesignConfig<ColorNames extends string>(
  config: DeepPartial<DesignConfig<ColorNames>>,
): DesignConfig<ColorNames> {
  return optimal(
    config,
    {
      border: shape({
        radius: unit(3),
        radiusScale: scale('perfect-fourth'),
        width: unit(1),
        widthScale: scale(0),
      }).exact(),
      breakpoints: tuple([
        unit(DEFAULT_BREAKPOINTS[0]),
        unit(DEFAULT_BREAKPOINTS[1]),
        unit(DEFAULT_BREAKPOINTS[2]),
        unit(DEFAULT_BREAKPOINTS[3]),
        unit(DEFAULT_BREAKPOINTS[4]),
      ]),
      colors: array(
        string<ColorNames>()
          .notEmpty()
          .camelCase(),
      )
        .notEmpty()
        .required(),
      shadow: shape({
        blur: unit(2),
        blurScale: scale('major-second'),
        depth: unit(1),
        depthScale: scale('major-third'),
        spread: unit(2),
        spreadScale: scale('major-third'),
      }).exact(),
      spacing: shape({
        type: string<SpacingType>('vertical-rhythm').oneOf(['unit', 'vertical-rhythm']),
        unit: number(DEFAULT_UNIT),
      }).exact(),
      strategy: string<StrategyType>('mobile-first').oneOf(['desktop-first', 'mobile-first']),
      typography: shape({
        fontFamily: string(SYSTEM_FONT_FAMILY).notEmpty(),
        fontSize: unit(16),
        headingScale: scale('major-third'),
        lineHeight: unit(1.5),
        responsiveScale: scale('minor-second'),
        textScale: scale('major-second'),
      }).exact(),
    },
    {
      name: 'Design',
      unknown: false,
    },
  );
}

function validateColorName<ColorNames extends string>(
  colors: ObjectOf<string | ColorConfig>,
  colorNames: ColorNames[],
) {
  const names = new Set<string>(colorNames);
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

export function validateThemeConfig<ColorNames extends string>(
  config: ThemeConfig<ColorNames>,
  colorNames: ColorNames[],
) {
  return optimal(config, {
    colors: object(
      union<string | ColorConfig>(
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
      .custom(value => validateColorName(value, colorNames))
      .required(),
    palettes: shape({
      danger: palette(),
      info: palette(),
      muted: palette(),
      neutral: palette(),
      primary: palette(),
      secondary: palette(),
      success: palette(),
      tertiary: palette(),
      warning: palette(),
    })
      .exact()
      .required(),
    scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
  });
}
