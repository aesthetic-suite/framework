import { deepMerge } from '@aesthetic/utils';
import { DeepPartial, ContrastLevel, ColorScheme, Hexcode } from '@aesthetic/system';
import { Path } from '@boost/common';
import optimal, { number, object, ObjectOf, Schema, shape, string, union } from 'optimal';
import Loader from './Loader';
import { SHADE_RANGES, THEMES_FILE } from './constants';
import {
  ThemesConfigFile,
  ThemeConfig,
  PalettesConfig,
  ColorConfig,
  PaletteState,
  PaletteConfig,
} from './types';

function hexcode() {
  return string()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu)
    .required();
}

export default class ThemesLoader extends Loader<ThemesConfigFile> {
  colorNames: string[];

  constructor(colorNames: string[]) {
    super();

    this.colorNames = colorNames;
  }

  getFileName() {
    return THEMES_FILE;
  }

  validate(config: DeepPartial<ThemesConfigFile>, filePath: Path): ThemesConfigFile {
    const themes: ThemesConfigFile['themes'] = {};

    // Merge themes that extend from each other,
    // as our validation requires many fields to exist
    if (config.themes) {
      Object.entries<ThemeConfig>(config.themes as ThemesConfigFile['themes']).forEach(
        ([name, theme]) => {
          if (theme.extends) {
            const parentTheme = themes[theme.extends];

            if (!parentTheme) {
              throw new Error(`Parent theme "${theme.extends}" does not exist.`);
            }

            themes[name] = deepMerge(parentTheme, theme);
          } else {
            themes[name] = theme;
          }
        },
      );

      // eslint-disable-next-line no-param-reassign
      config.themes = themes;
    }

    return optimal(
      config,
      {
        extends: string(),
        themes: this.themes(),
      },
      { file: process.env.NODE_ENV === 'test' ? undefined : filePath.path() },
    );
  }

  protected colorShade(defaultValue: number) {
    return union<number | string>(
      [number().oneOf(SHADE_RANGES.map(Number)), string().oneOf(SHADE_RANGES)],
      defaultValue,
    );
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
          failure: this.themePalette(),
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
    }).exact();
  }

  protected themePalette() {
    const color = string().required().notEmpty().custom(this.validatePaletteColorReference);

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

  protected validatePaletteColorReference = (name: string) => {
    const names = new Set<string>(this.colorNames);

    if (!names.has(name)) {
      throw new Error(`Invalid color "${name}".`);
    }
  };

  protected validateThemeImplementsColors = (
    colors: ObjectOf<Hexcode | ColorConfig>,
    schema: Schema<ThemesConfigFile>,
  ) => {
    const theme = schema.currentPath.split('.')[1];
    const names = new Set<string>(this.colorNames);
    const unknown = new Set<string>();

    // Theme extends another theme, so dont validate as it will merge
    if (schema.struct.themes?.[theme]?.extends) {
      return;
    }

    Object.keys(colors).forEach((color) => {
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
}
