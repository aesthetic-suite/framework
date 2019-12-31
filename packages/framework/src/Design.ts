import { DesignConfig, DesignTokens, Scale, PxUnit, RemUnit } from './types';
import { validateDesignConfig } from './validate';
import {
  SYSTEM_FONT_FAMILY,
  LAYERS,
  SCALES,
  BREAKPOINT_SIZES,
  HEADING_LEVELS,
  SHADOW_LEVELS,
} from './constants';

function toPx(value: number): PxUnit {
  return `${value}px`;
}

function toRem(value: number, rootSize: number): RemUnit {
  return `${(Math.max(value, 0) / rootSize).toFixed(2)}rem`;
}

function scaleDown(accumulator: number, scale: Scale): number {
  const factor = typeof scale === 'number' ? scale : SCALES[scale];

  return accumulator / factor;
}

function scaleUp(accumulator: number, scale: Scale): number {
  const factor = typeof scale === 'number' ? scale : SCALES[scale];

  return accumulator * factor;
}

export default class Design {
  protected config: DesignConfig;

  protected tokens: DesignTokens;

  constructor(config: Partial<DesignConfig>) {
    // @ts-ignore TODO: Add tuple upstream for breakpoints
    this.config = validateDesignConfig(config);
    this.tokens = this.compile();
  }

  unit = (...sizes: number[]): string => {
    const { type, unit } = this.config.spacing;
    const { fontSize, lineHeight } = this.config.typography;
    const calcUnit = type === 'vertical-rhythm' ? fontSize * lineHeight : unit;

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
          size: breakpoints[index],
          query: query.join(' and '),
        },
      };
    }, {});

    return tokens as DesignTokens['breakpoint'];
  }

  protected compileHeadings(): DesignTokens['heading'] {
    const { fontSize, headingScale } = this.config.typography;
    let lastHeading = scaleUp(fontSize, headingScale);

    const levels = new Array<number>(HEADING_LEVELS).fill(0);
    const tokens = levels.reduce((obj, index) => {
      const level = index + 1;
      const unit = toRem(lastHeading, fontSize);

      lastHeading = scaleUp(lastHeading, headingScale);

      return {
        ...obj,
        [level]: unit,
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
    const tokens = levels.reduce((obj, index) => {
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
    const {
      breakpoints,
      strategy,
      typography: { fontFamily, fontSize, lineHeight, responsiveScale },
    } = this.config;
    let lastSize = fontSize;

    const sizes = breakpoints.map(() => {
      if (strategy === 'mobile-first') {
        lastSize = scaleUp(lastSize, responsiveScale);
      } else {
        lastSize = scaleDown(lastSize, responsiveScale);
      }

      return toPx(lastSize);
    });

    return {
      fontFamily,
      lineHeight,
      responsiveFontSizes: sizes,
      rootFontSize: toPx(fontSize),
      systemFontFamily: SYSTEM_FONT_FAMILY,
    };
  }
}
