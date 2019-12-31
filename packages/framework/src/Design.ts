import { DesignConfig, DesignTokens, PxUnit, DeepPartial, ColorScheme, ThemeConfig } from './types';
import { toPx, toRem, scaleDown, scaleUp } from './unit';
import { validateDesignConfig } from './validate';
import {
  SYSTEM_FONT_FAMILY,
  LAYERS,
  BREAKPOINT_SIZES,
  HEADING_LEVELS,
  SHADOW_LEVELS,
} from './constants';
import Theme from './Theme';

export default class Design {
  protected readonly config: DesignConfig;

  protected readonly tokens: DesignTokens;

  constructor(config: DeepPartial<DesignConfig>) {
    // @ts-ignore TODO: Add tuple upstream for breakpoints
    this.config = validateDesignConfig(config);
    this.tokens = this.compile();

    if (this.config.strategy === 'mobile-first') {
      // Smallest to largest
      this.config.breakpoints.sort((a, b) => a - b);
    } else {
      // Largest to smallest
      this.config.breakpoints.sort((a, b) => b - a);
    }
  }

  createTheme(config: ThemeConfig): Theme {
    return new Theme(config, this.tokens);
  }

  unit = (...sizes: number[]): string => {
    const { type, unit: baseUnit } = this.config.spacing;
    const { fontSize, lineHeight } = this.config.typography;
    let calcUnit = baseUnit;

    if (type === 'vertical-rhythm') {
      calcUnit = fontSize * lineHeight;
    }

    return sizes.map(size => toRem(size * calcUnit, fontSize)).join(' ');
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
    const { radius, radiusScale, width, widthScale } = this.config.border;

    return {
      small: {
        radius: toPx(scaleDown(radius, radiusScale)),
        width: toPx(scaleDown(width, widthScale)),
      },
      normal: {
        radius: toPx(radius),
        width: toPx(width),
      },
      large: {
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
    const {
      strategy,
      typography: { fontSize, responsiveScale },
    } = this.config;
    let lastFontSize = fontSize;

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
    const { fontSize, headingScale } = this.config.typography;
    let lastHeading = scaleUp(fontSize, headingScale);

    const levels = new Array<number>(HEADING_LEVELS).fill(0);
    const tokens = levels.reduce((obj, no, index) => {
      const level = index + 1;
      const size = toRem(lastHeading, fontSize);

      lastHeading = scaleUp(lastHeading, headingScale);

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
    const { blur, blurScale, depth, depthScale, spread, spreadScale } = this.config.shadow;
    let lastBlur = blur;
    let lastDepth = depth;
    let lastSpread = spread;

    const levels = new Array<number>(SHADOW_LEVELS).fill(0);
    const tokens = levels.reduce((obj, no, index) => {
      const level = index + 1;
      const token = {
        blur: toPx(lastBlur),
        depth: toPx(lastDepth),
        spread: toPx(lastSpread),
      };

      lastBlur = scaleUp(lastBlur, blurScale);
      lastDepth = scaleUp(lastDepth, depthScale);
      lastSpread = scaleUp(lastSpread, spreadScale);

      return {
        ...obj,
        [level]: token,
      };
    }, {});

    return tokens as DesignTokens['shadow'];
  }

  protected compileSpacing(): DesignTokens['spacing'] {
    return {
      compact: this.unit(0.25),
      tight: this.unit(0.5),
      normal: this.unit(1),
      loose: this.unit(2),
      spacious: this.unit(3),
    };
  }

  protected compileText(): DesignTokens['text'] {
    const { fontSize, textScale } = this.config.typography;

    return {
      small: toRem(scaleDown(fontSize, textScale), fontSize),
      normal: '1rem',
      large: toRem(scaleUp(fontSize, textScale), fontSize),
    };
  }

  protected compileTypography(): DesignTokens['typography'] {
    const { fontFamily, fontSize, lineHeight } = this.config.typography;

    return {
      fontFamily,
      lineHeight,
      rootFontSize: toPx(fontSize),
      systemFontFamily: SYSTEM_FONT_FAMILY,
    };
  }
}
