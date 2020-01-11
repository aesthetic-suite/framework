import { toArray } from 'aesthetic-utils';
import {
  BREAKPOINT_SIZES,
  HEADING_LEVELS,
  LAYERS,
  SHADOW_SIZES,
  FONT_FAMILIES,
} from '@aesthetic/system';
import Theme from './Theme';
import { SCALES } from './constants';
import {
  BreakpointCondition,
  DesignTemplate,
  Scale,
  BreakpointTemplate,
  ShadowTemplate,
  DesignConfig,
  ThemeConfig,
} from './types';

function scale(accumulator: number, scaling: Scale, type: 'up' | 'down'): number {
  const factor = (typeof scaling === 'number' ? scaling : SCALES[scaling]) ?? 0;

  if (factor === 0) {
    return accumulator;
  }

  return type === 'up' ? accumulator * factor : accumulator / factor;
}

export function scaleDown(accumulator: number, scaling: Scale): number {
  return scale(accumulator, scaling, 'down');
}

export function scaleUp(accumulator: number, scaling: Scale): number {
  return scale(accumulator, scaling, 'up');
}

export default class DesignSystem {
  readonly template: DesignTemplate;

  private readonly config: DesignConfig;

  constructor(config: DesignConfig) {
    // Smallest to largest for mobile, and reversed for desktop
    config.breakpoints.sort((a, b) => (config.strategy === 'mobile-first' ? a - b : b - a));

    this.config = config;
    this.template = this.compile();
  }

  createTheme(config: ThemeConfig): Theme {
    return new Theme(config, this.template);
  }

  protected compile(): DesignTemplate {
    return {
      border: this.compileBorders(),
      breakpoint: this.compileBreakpoints(),
      heading: this.compileHeadings(),
      layer: this.compileLayers(),
      shadow: this.compileShadows(),
      spacing: this.compileSpacing(),
      text: this.compileText(),
      typography: this.compileTypography(),
    };
  }

  protected compileBorders(): DesignTemplate['border'] {
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

  protected compileBreakpoints(): DesignTemplate['breakpoint'] {
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

      const token: BreakpointTemplate = {
        queryConditions: conditions,
        querySize: breakpoints[index],
        rootTextSize: fontSizes[index],
      };

      return {
        ...obj,
        [name]: token,
      };
    }, {});

    return tokens as DesignTemplate['breakpoint'];
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

  protected compileHeadings(): DesignTemplate['heading'] {
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

    return tokens as DesignTemplate['heading'];
  }

  protected compileLayers(): DesignTemplate['layer'] {
    return { ...LAYERS };
  }

  protected compileShadows(): DesignTemplate['shadow'] {
    const configs = toArray(this.config.shadows);

    // Increase the scale of each config for each size
    const matrix = configs.map(config => {
      const { blur, blurScale, spread, spreadScale, x, xScale, y, yScale } = config;
      let lastX = x;
      let lastY = y;
      let lastBlur = blur;
      let lastSpread = spread;

      return SHADOW_SIZES.map(() => {
        const token: ShadowTemplate = {
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

    return tokens as DesignTemplate['shadow'];
  }

  protected compileSpacing(): DesignTemplate['spacing'] {
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

  protected compileText(): DesignTemplate['text'] {
    const { lineHeight, lineHeightScale, size, sizeScale } = this.config.typography.text;

    return {
      sm: {
        lineHeight: scaleDown(lineHeight, lineHeightScale),
        size: scaleDown(size, sizeScale),
      },
      base: {
        lineHeight,
        size,
      },
      lg: {
        lineHeight: scaleUp(lineHeight, lineHeightScale),
        size: scaleUp(size, sizeScale),
      },
    };
  }

  protected compileTypography(): DesignTemplate['typography'] {
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
