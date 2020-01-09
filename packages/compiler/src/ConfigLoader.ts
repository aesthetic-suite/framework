import fs from 'fs';
import yaml from 'js-yaml';
import {
  DeepPartial,
  ColorScheme,
  SCALES,
  DEFAULT_UNIT,
  DEFAULT_BREAKPOINTS,
  FONT_FAMILIES,
} from '@aesthetic/framework';
import optimal, {
  array,
  number,
  shape,
  string,
  tuple,
  union,
  object,
  ObjectOf,
  Schema,
} from 'optimal';
import {
  ConfigFile,
  ContrastLevel,
  ColorConfig,
  ColorShade,
  Scale,
  ScaleType,
  SpacingType,
} from './types';

export function hexcode() {
  return string()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu)
    .required();
}

export function scale(defaultValue: Scale = 'major-third') {
  return union<Scale>(
    [number().gte(0), string<ScaleType>().oneOf(Object.keys(SCALES) as ScaleType[])],
    defaultValue,
  );
}

export function unit(defaultValue: number = 0) {
  return number(defaultValue);
}

export default class ConfigLoader {
  async load(filePath: string): Promise<ConfigFile> {
    const data = await fs.promises.readFile(filePath, 'utf8');

    return this.validate(yaml.safeLoad(data));
  }

  validate(config: DeepPartial<ConfigFile>): ConfigFile {
    const shadowShape = shape({
      blur: unit(2),
      blurScale: scale('major-second'),
      spread: unit(2),
      spreadScale: scale('major-third'),
      x: unit(0),
      xScale: scale('major-third'),
      y: unit(1),
      yScale: scale('major-third'),
    }).exact();

    const typographyShape = shape({
      lineHeight: unit(1.25),
      lineHeightScale: scale('major-second'),
      size: unit(16),
      sizeScale: scale('major-second'),
    }).exact();

    return optimal(config, {
      borders: shape({
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
        string()
          .notEmpty()
          .camelCase(),
      )
        .notEmpty()
        .required(),
      shadows: union([shadowShape, array(shadowShape)], shadowShape.default()),
      spacing: shape({
        type: string('vertical-rhythm').oneOf<SpacingType>(['unit', 'vertical-rhythm']),
        unit: number(DEFAULT_UNIT),
      }).exact(),
      strategy: string('mobile-first').oneOf(['desktop-first', 'mobile-first']),
      themes: object(
        shape({
          colors: object(
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
            .custom(this.validateThemeImplementsColors)
            .required(),
          contrast: string('none').oneOf<ContrastLevel>(['normal', 'high', 'low']),
          extends: string(),
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
        }),
      ),
      typography: shape({
        fontFamily: string(FONT_FAMILIES['web-system']).notEmpty(),
        heading: typographyShape,
        text: typographyShape,
        responsiveScale: scale('minor-second'),
      }).exact(),
    });
  }

  protected createPaletteBlueprint() {
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

  protected validateThemeImplementsColors = (
    colors: ObjectOf<string | ColorConfig>,
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
      // @ts-ignore TODO
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
    // @ts-ignore TODO
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
