import optimal, { array, number, object, shape, string, union } from 'optimal';
import { DEFAULT_BREAKPOINTS, SYSTEM_FONT_FAMILY, SCALES, DEFAULT_UNIT } from './constants';
import { DesignConfig, Scale, ThemeConfig, SpacingType, StrategyType, ColorScheme } from './types';

function hexcode() {
  return string()
    .required()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu);
}

function scale(defaultValue: Scale = 'major-third') {
  return union<Scale>([number().gte(0), string().oneOf(Object.keys(SCALES))], defaultValue);
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
  return number(defaultValue).gte(0);
}

function palette() {
  return shape({
    bg: state(),
    fg: state(),
  })
    .exact()
    .required();
}

export function validateDesignConfig(config: Partial<DesignConfig>) {
  return optimal(
    config,
    {
      border: shape({
        radius: unit(3),
        radiusScale: scale('perfect-fourth'),
        width: unit(1),
        widthScale: scale(0),
      }).exact(),
      breakpoints: array(unit(), DEFAULT_BREAKPOINTS)
        .notEmpty()
        .custom(list => {
          if (list.length !== 5) {
            throw new Error('Breakpoints required 5 values.');
          }
        }),
      colors: array(
        string()
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

export function validateThemeConfig(config: Partial<ThemeConfig>) {
  return optimal(config, {
    colors: object(
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
    )
      // .custom(this.validateColorName)
      .required(),
    extends: string(), // .custom(this.validateExtendsTheme),
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
    scheme: string<ColorScheme>('light').oneOf(['dark', 'light']),
  });
}

/* function validateColorName(colors: ThemeConfig['colors']) {
  const names = new Set(this.config.colors);
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

function validateExtendsTheme(name: string) {
  if (name && !this.themes[name]) {
    throw new Error(`Invalid extends, theme "${name}" does not exist.`);
  }
} */
