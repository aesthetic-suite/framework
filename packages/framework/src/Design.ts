import optimal, { array, number, object, shape, string, union } from 'optimal';
import { DEFAULT_BREAKPOINTS, SYSTEM_FONT_FAMILY, SCALES } from './constants';
import { Config, Scale, ColorScheme, StrategyType, SpacingType, ThemeConfig } from './types';

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

export default class Design {
  config: Config;

  constructor(config: Partial<Config>) {
    // @ts-ignore TODO: Add tuple upstream for breakpoints
    this.config = optimal(
      config,
      {
        border: shape({
          radius: unit(),
          radiusScale: scale('major-second'),
          width: unit(1),
          widthScale: scale('minor-second'),
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
          blur: unit(),
          blurScale: scale(1),
          depth: unit(2),
          depthScale: scale(1.25),
          spread: unit(2),
          spreadScale: scale(1.5),
        }).exact(),
        spacing: shape({
          type: string<SpacingType>('vertical-rhythm').oneOf(['unit', 'vertical-rhythm']),
          unit: number(),
        }).exact(),
        strategy: string<StrategyType>('mobile-first').oneOf(['desktop-first', 'mobile-first']),
        themes: object(
          shape({
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
              .custom(this.validateColorName)
              .required(),
            extends: string().custom(this.validateExtendsTheme),
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
          })
            .exact()
            .required(),
        ),
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
        name: 'Design System',
        unknown: false,
      },
    );
  }

  protected validateColorName(colors: ThemeConfig['colors'], config: Config) {
    const names = new Set(config.colors);
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

  protected validateExtendsTheme(name: string, config: Config) {
    if (name && !config.themes[name]) {
      throw new Error(`Invalid extends, theme "${name}" does not exist.`);
    }
  }
}
