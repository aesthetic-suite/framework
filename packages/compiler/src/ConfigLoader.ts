import fs from 'fs';
import yaml from 'js-yaml';
import { DeepPartial, ColorScheme, ContrastLevel } from '@aesthetic/system';
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
  ColorConfig,
  ColorShade,
  Scale,
  ScaleType,
  SpacingType,
  BreakpointConfig,
  StrategyType,
  BreakpointListConfig,
  TypographyConfig,
  PlatformType,
  HeadingScaledConfig,
  HeadingSizedConfig,
  TextScaledConfig,
  TextSizedConfig,
} from './types';
import { SCALES, DEFAULT_BREAKPOINTS, DEFAULT_UNIT, FONT_FAMILIES } from './constants';

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
  platform: PlatformType;

  constructor(platform: PlatformType) {
    this.platform = platform;
  }

  async load(filePath: string): Promise<ConfigFile> {
    const data = await fs.promises.readFile(filePath, 'utf8');

    return this.validate(yaml.safeLoad(data));
  }

  validate(config: DeepPartial<ConfigFile>): ConfigFile {
    // @ts-ignore
    return optimal(config, {
      breakpoints: this.breakpoints(),
      colors: this.colors(),
      spacing: this.spacing(),
      strategy: this.strategy(),
      typography: this.typography(),
    });
  }

  protected breakpoints() {
    const [xs, sm, md, lg, xl] = DEFAULT_BREAKPOINTS;

    return union<BreakpointConfig>(
      [
        tuple<BreakpointListConfig>([unit(xs), unit(sm), unit(md), unit(lg), unit(xl)]),
        shape({
          xs: unit(xs),
          sm: unit(sm),
          md: unit(md),
          lg: unit(lg),
          xl: unit(xl),
        }),
      ],
      DEFAULT_BREAKPOINTS,
    );
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

  protected spacing() {
    return shape({
      type: string('vertical-rhythm').oneOf<SpacingType>(['unit', 'vertical-rhythm']),
      unit: number(DEFAULT_UNIT),
    }).exact();
  }

  protected strategy() {
    return string('mobile-first').oneOf<StrategyType>(['desktop-first', 'mobile-first']);
  }

  protected typography() {
    const defaultValue = () => FONT_FAMILIES[this.platform];

    return shape({
      font: union<TypographyConfig['font']>(
        [
          string(),
          shape({
            text: string(defaultValue),
            heading: string(defaultValue),
            locale: object(string()),
          }),
        ],
        defaultValue,
      ),
      text: this.typographyText(),
      heading: this.typographyHeading(),
    }).exact();
  }

  protected typographyHeading() {
    const headingScaled = shape<HeadingScaledConfig>({
      letterSpacing: unit(0),
      letterSpacingScale: scale(0),
      lineHeight: unit(1.25),
      lineHeightScale: scale('major-second'),
      responsiveScale: scale('minor-second'),
      size: unit(16),
      sizeScale: scale('major-second'),
    }).exact();

    const headingSizes = shape<HeadingSizedConfig>({
      level1: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      level2: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      level3: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      level4: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      level5: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      level6: shape({
        letterSpacing: unit(0),
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      responsiveScale: scale('minor-second'),
    });

    return union<TypographyConfig['heading']>(
      [headingScaled, headingSizes],
      headingScaled.default(),
    );
  }

  protected typographyText() {
    const textScaled = shape<TextScaledConfig>({
      lineHeight: unit(1.25),
      lineHeightScale: scale('major-second'),
      responsiveScale: scale('minor-second'),
      size: unit(16),
      sizeScale: scale('major-second'),
    }).exact();

    const textSizes = shape<TextSizedConfig>({
      small: shape({
        lineHeight: unit(1.25),
        size: unit(14),
      }).exact(),
      default: shape({
        lineHeight: unit(1.25),
        size: unit(16),
      }).exact(),
      large: shape({
        lineHeight: unit(1.25),
        size: unit(18),
      }).exact(),
      responsiveScale: scale('minor-second'),
    });

    return union<TypographyConfig['text']>([textScaled, textSizes], textScaled.default());
  }

  // validateOld(config: DeepPartial<ConfigFile>): ConfigFile {
  //   const shadowShape = shape({
  //     blur: unit(2),
  //     blurScale: scale('major-second'),
  //     spread: unit(2),
  //     spreadScale: scale('major-third'),
  //     x: unit(0),
  //     xScale: scale('major-third'),
  //     y: unit(1),
  //     yScale: scale('major-third'),
  //   }).exact();

  //   return optimal(config, {
  //     borders: shape({
  //       radius: unit(3),
  //       radiusScale: scale('perfect-fourth'),
  //       width: unit(1),
  //       widthScale: scale(0),
  //     }).exact(),
  //     shadows: union([shadowShape, array(shadowShape)], shadowShape.default()),
  //     themes: object(
  //       shape({
  //         colors: object(
  //           union(
  //             [
  //               hexcode(),
  //               shape({
  //                 '00': hexcode(),
  //                 '10': hexcode(),
  //                 '20': hexcode(),
  //                 '30': hexcode(),
  //                 '40': hexcode(),
  //                 '50': hexcode(),
  //                 '60': hexcode(),
  //                 '70': hexcode(),
  //                 '80': hexcode(),
  //                 '90': hexcode(),
  //               })
  //                 .exact()
  //                 .required(),
  //             ],
  //             '',
  //           ),
  //         )
  //           .custom(this.validateThemeImplementsColors)
  //           .required(),
  //         contrast: string('none').oneOf<ContrastLevel>(['normal', 'high', 'low']),
  //         extends: string(),
  //         palettes: shape({
  //           danger: this.createPaletteBlueprint(),
  //           info: this.createPaletteBlueprint(),
  //           muted: this.createPaletteBlueprint(),
  //           neutral: this.createPaletteBlueprint(),
  //           primary: this.createPaletteBlueprint(),
  //           secondary: this.createPaletteBlueprint(),
  //           success: this.createPaletteBlueprint(),
  //           tertiary: this.createPaletteBlueprint(),
  //           warning: this.createPaletteBlueprint(),
  //         })
  //           .exact()
  //           .required(),
  //         scheme: string('light').oneOf<ColorScheme>(['dark', 'light']),
  //       }),
  //     ),
  //   });
  // }

  // protected createPaletteBlueprint() {
  //   const color = () => string().custom(this.validatePaletteColorReference);

  //   const state = () =>
  //     shape({
  //       base: color().required(),
  //       disabled: color(),
  //       focused: color(),
  //       hovered: color(),
  //       selected: color(),
  //     })
  //       .exact()
  //       .required();

  //   return shape({
  //     bg: state(),
  //     fg: state(),
  //   })
  //     .exact()
  //     .required();
  // }

  // protected validateThemeImplementsColors = (
  //   colors: ObjectOf<string | ColorConfig>,
  //   schema: Schema<ConfigFile>,
  // ) => {
  //   const names = new Set<string>(schema.struct.colors);
  //   const unknown = new Set<string>();

  //   Object.keys(colors).forEach(color => {
  //     if (names.has(color)) {
  //       names.delete(color);
  //     } else {
  //       unknown.add(color);
  //     }
  //   });

  //   if (names.size > 0) {
  //     throw new Error(
  //       `Theme has not implemented the following colors: ${Array.from(names).join(', ')}`,
  //     );
  //   }

  //   if (unknown.size > 0) {
  //     throw new Error(`Theme is using unknown colors: ${Array.from(unknown).join(', ')}`);
  //   }
  // };

  // protected validatePaletteColorReference = (ref: string, schema: Schema<ConfigFile>) => {
  //   const colors = schema.struct.colors!;

  //   if (!ref) {
  //     return;
  //   }

  //   // Hue + shade: black.10
  //   if (ref.includes('.')) {
  //     const [hue, shade] = ref.split('.') as [string, ColorShade];
  //     // @ts-ignore TODO
  //     const config: string | ColorConfig = colors[hue];

  //     if (typeof config === 'string') {
  //       throw new TypeError(
  //         `Invalid color reference, "${ref}" is pointing to a shade, but the color does not use shades.`,
  //       );
  //     } else if (!config || !config[shade]) {
  //       throw new Error(`Invalid color reference, "${ref}" does not exist.`);
  //     }

  //     return;
  //   }

  //   // Hue w/ no shade: black
  //   // @ts-ignore TODO
  //   const config: string | ColorConfig = colors[ref];

  //   if (config && typeof config !== 'string') {
  //     throw new Error(
  //       `Invalid color reference, "${ref}" is pointing to shadeless color, but the color is using shades.`,
  //     );
  //   } else if (!config) {
  //     throw new Error(`Invalid color reference, "${ref}" does not exist.`);
  //   }
  // };
}
