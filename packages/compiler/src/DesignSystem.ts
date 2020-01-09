import { toArray } from 'aesthetic-utils';
import Theme from './Theme';
import { toRem, scaleDown, scaleUp } from './unit';
import { BREAKPOINT_SIZES, FONT_FAMILIES, HEADING_LEVELS, LAYERS, SHADOW_SIZES } from './constants';
import {
  DesignConfig,
  DesignTokens,
  ThemeConfig,
  ShadowToken,
  BreakpointCondition,
  BreakpointToken,
  DesignTemplate,
} from './types';

export default class Design<ColorNames extends string = string> {
  readonly template: DesignTemplate;

  private readonly config: DesignConfig<ColorNames>;

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

    // TODO platform agnostic
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
        radius: scaleDown(radius, radiusScale),
        width: scaleDown(width, widthScale),
      },
      base: {
        radius,
        width,
      },
      lg: {
        radius: scaleUp(radius, radiusScale),
        width: scaleUp(width, widthScale),
      },
    };
  }

  protected compileBreakpoints(): DesignTokens['breakpoint'] {
    const { breakpoints, strategy } = this.config;
    const fontSizes = this.compileBreakpointFontSizes();

    const tokens = BREAKPOINT_SIZES.reduce((obj, name, index) => {
      const size = breakpoints[index];
      const conditions: BreakpointCondition[] = [];

      if (strategy === 'mobile-first') {
        conditions.push(['min-width', size]);

        const next = breakpoints[index + 1];

        if (next) {
          conditions.push(['max-width', next - 1]);
        }
      } else {
        const prev = breakpoints[index - 1];

        if (prev) {
          conditions.push(['min-width', prev + 1]);
        }

        conditions.push(['max-width', size]);
      }

      const token: BreakpointToken = {
        queryConditions: conditions,
        querySize: breakpoints[index],
        rootTextSize: fontSizes[index],
      };

      return {
        ...obj,
        [name]: token,
      };
    }, {});

    return tokens as DesignTokens['breakpoint'];
  }

  protected compileBreakpointFontSizes(): number[] {
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

      return lastFontSize;
    });

    if (strategy === 'desktop-first') {
      fontSizes.reverse();
    }

    return fontSizes;
  }

  protected compileHeadings(): DesignTokens['heading'] {
    const { size: baseSize, sizeScale } = this.config.typography.heading;
    let lastHeading = baseSize;

    const tokens = HEADING_LEVELS.reduce((obj, level) => {
      const size = lastHeading;

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
          x: lastX,
          y: lastY,
          blur: lastBlur,
          spread: lastSpread,
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
    // These are the multipliers, not the actual values
    return {
      xs: 0.25,
      sm: 0.5,
      base: 1,
      md: 2,
      lg: 3,
      xl: 4,
    };
  }

  protected compileText(): DesignTokens['text'] {
    const { size, sizeScale } = this.config.typography.text;

    return {
      sm: scaleDown(size, sizeScale),
      base: size,
      lg: scaleUp(size, sizeScale),
    };
  }

  protected compileTypography(): DesignTokens['typography'] {
    const { fontFamily, text } = this.config.typography;
    const { size, lineHeight } = text;

    return {
      fontFamily,
      rootLineHeight: lineHeight,
      rootTextSize: size,
      systemFontFamily: FONT_FAMILIES['web-system'],
    };
  }
}
