import optimal, { array, number, shape, string, tuple, union } from 'optimal';
import { toArray } from 'aesthetic-utils';
import Theme from './Theme';
import {
  DeepPartial,
  DesignConfig,
  DesignTokens,
  PxUnit,
  SpacingType,
  StrategyType,
  ThemeConfig,
  ShadowConfig,
  ShadowToken,
} from './types';
import { toPx, toRem, scaleDown, scaleUp } from './unit';
import { unit, scale } from './validate';
import {
  BREAKPOINT_SIZES,
  DEFAULT_BREAKPOINTS,
  DEFAULT_UNIT,
  FONT_FAMILIES,
  HEADING_LEVELS,
  LAYERS,
  SHADOW_SIZES,
} from './constants';

export default class Design<ColorNames extends string = string> {
  private readonly config: DesignConfig<ColorNames>;

  private readonly tokens: DesignTokens;

  constructor(config: DeepPartial<DesignConfig<ColorNames>>) {
    this.config = this.validateConfig(config);
    this.tokens = this.compile();

    if (this.config.strategy === 'mobile-first') {
      // Smallest to largest
      this.config.breakpoints.sort((a, b) => a - b);
    } else {
      // Largest to smallest
      this.config.breakpoints.sort((a, b) => b - a);
    }
  }

  createTheme(config: ThemeConfig<ColorNames>): Theme<ColorNames> {
    return new Theme(config, this.tokens, this.config.colors);
  }

  unit = (...sizes: number[]): string => {
    const { type, unit: baseUnit } = this.config.spacing;
    const { size: rootSize, lineHeight } = this.config.typography.text;
    let calcUnit = baseUnit;

    if (type === 'vertical-rhythm') {
      calcUnit = rootSize * lineHeight;
    }

    return sizes.map(size => toRem(size * calcUnit, rootSize)).join(' ');
  };

  protected compile(): DesignTokens {
    return {
      border: this.compileBorders(),
      breakpoint: this.compileBreakpoints(),
      heading: this.compileHeadings(),
      layer: this.compileLayers(),
      shadow: this.compileShadows(),
      spacing: this.compileSpacing(),
      text: this.compileText(),
      typography: this.compileTypography(),
      unit: this.unit,
    };
  }

  protected compileBorders(): DesignTokens['border'] {
    const { radius, radiusScale, width, widthScale } = this.config.borders;

    return {
      sm: {
        radius: toPx(scaleDown(radius, radiusScale)),
        width: toPx(scaleDown(width, widthScale)),
      },
      base: {
        radius: toPx(radius),
        width: toPx(width),
      },
      lg: {
        radius: toPx(scaleUp(radius, radiusScale)),
        width: toPx(scaleUp(width, widthScale)),
      },
    };
  }

  protected compileBreakpoints(): DesignTokens['breakpoint'] {
    const { breakpoints, strategy } = this.config;
    const fontSizes = this.compileBreakpointFontSizes();

    const tokens = BREAKPOINT_SIZES.reduce((obj, name, index) => {
      const size = breakpoints[index];
      const query: string[] = [];

      if (strategy === 'mobile-first') {
        query.push(`(min-width: ${toPx(size)})`);

        const next = breakpoints[index + 1];

        if (next) {
          query.push(`(max-width: ${toPx(next - 1)})`);
        }
      } else {
        const prev = breakpoints[index - 1];

        if (prev) {
          query.push(`(min-width: ${toPx(prev + 1)})`);
        }

        query.push(`(max-width: ${toPx(size)})`);
      }

      return {
        ...obj,
        [name]: {
          fontSize: fontSizes[index],
          size: breakpoints[index],
          query: query.join(' and '),
        },
      };
    }, {});

    return tokens as DesignTokens['breakpoint'];
  }

  protected compileBreakpointFontSizes(): PxUnit[] {
    const { strategy, typography } = this.config;
    const {
      responsiveScale,
      text: { size },
    } = typography;
    let lastFontSize = size;

    const fontSizes = BREAKPOINT_SIZES.map(() => {
      if (strategy === 'mobile-first') {
        lastFontSize = scaleUp(lastFontSize, responsiveScale);
      } else {
        lastFontSize = scaleDown(lastFontSize, responsiveScale);
      }

      return toPx(lastFontSize);
    });

    if (strategy === 'desktop-first') {
      fontSizes.reverse();
    }

    return fontSizes;
  }

  protected compileHeadings(): DesignTokens['heading'] {
    const { size: rootSize } = this.config.typography.text;
    const { size: baseSize, sizeScale } = this.config.typography.heading;
    let lastHeading = baseSize;

    const levels = new Array<number>(HEADING_LEVELS).fill(0);
    const tokens = levels.reduce((obj, no, index) => {
      const level = index + 1;
      const size = toRem(lastHeading, rootSize);

      lastHeading = scaleUp(lastHeading, sizeScale);

      return {
        ...obj,
        [level]: size,
      };
    }, {});

    return tokens as DesignTokens['heading'];
  }

  protected compileLayers(): DesignTokens['layer'] {
    return { ...LAYERS };
  }

  protected compileShadows(): DesignTokens['shadow'] {
    const configs = toArray(this.config.shadows);

    // Increase the scale of each config for each size
    const matrix = configs.map(config => {
      const { blur, blurScale, spread, spreadScale, x, xScale, y, yScale } = config;
      let lastX = x;
      let lastY = y;
      let lastBlur = blur;
      let lastSpread = spread;

      return SHADOW_SIZES.map(() => {
        const token: ShadowToken = {
          x: toPx(lastX),
          y: toPx(lastY),
          blur: toPx(lastBlur),
          spread: toPx(lastSpread),
        };

        lastX = scaleUp(lastX, xScale);
        lastY = scaleUp(lastY, yScale);
        lastBlur = scaleUp(lastBlur, blurScale);
        lastSpread = scaleUp(lastSpread, spreadScale);

        return token;
      });
    });

    const tokens = SHADOW_SIZES.reduce(
      (obj, name, index) => ({
        ...obj,
        [name]: matrix.map(node => node[index]),
      }),
      {},
    );

    return tokens as DesignTokens['shadow'];
  }

  protected compileSpacing(): DesignTokens['spacing'] {
    return {
      xs: this.unit(0.25),
      sm: this.unit(0.5),
      base: this.unit(1),
      md: this.unit(2),
      lg: this.unit(3),
      xl: this.unit(4),
    };
  }

  protected compileText(): DesignTokens['text'] {
    const { size, sizeScale } = this.config.typography.text;

    return {
      sm: toRem(scaleDown(size, sizeScale), size),
      base: '1rem',
      lg: toRem(scaleUp(size, sizeScale), size),
    };
  }

  protected compileTypography(): DesignTokens['typography'] {
    const { fontFamily, text } = this.config.typography;
    const { size, lineHeight } = text;

    return {
      fontFamily,
      rootLineHeight: lineHeight,
      rootTextSize: toPx(size),
      systemFontFamily: FONT_FAMILIES['web-system'],
    };
  }

  protected validateConfig = (
    config: DeepPartial<DesignConfig<ColorNames>>,
  ): DesignConfig<ColorNames> => {
    const shadowDefault: ShadowConfig = {
      blur: 2,
      blurScale: 'major-second',
      spread: 2,
      spreadScale: 'major-third',
      x: 0,
      xScale: 0,
      y: 1,
      yScale: 'major-third',
    };

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
        string<ColorNames>()
          .notEmpty()
          .camelCase(),
      )
        .notEmpty()
        .required(),
      shadows: union<ShadowConfig | ShadowConfig[]>(
        [shadowShape, array(shadowShape)],
        shadowDefault,
      ),
      spacing: shape({
        type: string('vertical-rhythm').oneOf<SpacingType>(['unit', 'vertical-rhythm']),
        unit: number(DEFAULT_UNIT),
      }).exact(),
      strategy: string('mobile-first').oneOf<StrategyType>(['desktop-first', 'mobile-first']),
      typography: shape({
        fontFamily: string(FONT_FAMILIES['web-system']).notEmpty(),
        heading: typographyShape,
        text: typographyShape,
        responsiveScale: scale('minor-second'),
      }).exact(),
    });
  };
}
