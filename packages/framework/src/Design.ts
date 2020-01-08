import { toArray } from 'aesthetic-utils';
import Theme from './Theme';
import { toPx, toRem, scaleDown, scaleUp } from './unit';
import { BREAKPOINT_SIZES, FONT_FAMILIES, HEADING_LEVELS, LAYERS, SHADOW_SIZES } from './constants';
import { DesignConfig, DesignTokens, PxUnit, ThemeConfig, ShadowToken } from './types';

export default class Design<ColorNames extends string = string> {
  private readonly config: DesignConfig<ColorNames>;

  private readonly tokens: DesignTokens;

  constructor(config: DesignConfig<ColorNames>) {
    // Smallest to largest for mobile, and reversed for desktop
    config.breakpoints.sort((a, b) => (config.strategy === 'mobile-first' ? a - b : b - a));

    this.config = config;
    this.tokens = this.compile();
  }

  createTheme(config: ThemeConfig<ColorNames>): Theme<ColorNames> {
    return new Theme(config, this.tokens);
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
}
