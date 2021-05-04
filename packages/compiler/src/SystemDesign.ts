import { camelCase, kebabCase } from 'lodash';
import { BREAKPOINT_SIZES, DEPTHS, FONT_FAMILIES, SCALES, SHADOW_SIZES } from './constants';
import SystemTheme from './SystemTheme';
import {
  BorderTemplate,
  BreakpointCondition,
  BreakpointTemplate,
  DesignConfig,
  DesignTemplate,
  Scale,
  SystemOptions,
  ThemeConfig,
  TypographyTemplate,
} from './types';

function scale(accumulator: number, scaling: Scale, type: 'down' | 'up'): number {
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

export function quote(value: string): string {
  return (value || '').replace(/'/gu, '"');
}

export default class SystemDesign {
  dashedName: string;

  name: string;

  template: DesignTemplate;

  private readonly config: DesignConfig;

  private readonly options: SystemOptions;

  constructor(name: string, config: DesignConfig, options: SystemOptions) {
    this.name = camelCase(name);
    this.dashedName = kebabCase(name);
    this.config = config;
    this.options = options;
    this.template = this.compile();
  }

  createTheme(name: string, config: ThemeConfig): SystemTheme {
    return new SystemTheme(name, config);
  }

  protected compile(): DesignTemplate {
    const text = this.compileText();

    return {
      border: this.compileBorders(),
      breakpoint: this.compileBreakpoints(text),
      depth: this.compileDepth(),
      heading: this.compileHeadings(),
      shadow: this.compileShadows(),
      spacing: this.compileSpacing(text),
      text,
      typography: this.compileTypography(text),
    };
  }

  protected compileBorders(): DesignTemplate['border'] {
    const { borders } = this.config;
    let sm: BorderTemplate = { radius: 0, width: 0 };
    let df: BorderTemplate = { radius: 0, width: 0 };
    let lg: BorderTemplate = { radius: 0, width: 0 };

    // Explicit values
    if ('small' in borders && 'default' in borders && 'large' in borders) {
      ({ small: sm, default: df, large: lg } = borders);

      // Scaled values
    } else {
      const { radius, radiusScale, width, widthScale } = borders;

      sm.radius = scaleDown(radius, radiusScale);
      sm.width = scaleDown(width, widthScale);

      df.radius = radius;
      df.width = width;

      lg.radius = scaleUp(radius, radiusScale);
      lg.width = scaleUp(width, widthScale);
    }

    return { sm, df, lg };
  }

  protected compileBreakpoints(text: DesignTemplate['text']): DesignTemplate['breakpoint'] {
    const { responsive } = this.config;
    const { breakpoints, lineHeightScale, textScale } = responsive;
    const points: number[] = [];

    if (Array.isArray(breakpoints)) {
      points.push(...breakpoints);
    } else {
      points.push(...Object.values(breakpoints));
    }

    // Sort mobile ASC
    points.sort((a, b) => a - b);

    // Map a list of template objects
    let lastLineHeight = text.df.lineHeight;
    let lastTextSize = text.df.size;

    const templates: BreakpointTemplate[] = BREAKPOINT_SIZES.map((name, index) => {
      const size = points[index];
      const conditions: BreakpointCondition[] = [];

      conditions.push(['min-width', size]);
      lastLineHeight = scaleUp(lastLineHeight, lineHeightScale);
      lastTextSize = scaleUp(lastTextSize, textScale);

      return {
        queryConditions: conditions,
        querySize: size,
        rootLineHeight: lastLineHeight,
        rootTextSize: lastTextSize,
      };
    });

    // Destructure into the right sizes
    const [xs, sm, md, lg, xl] = templates;

    return { xs, sm, md, lg, xl };
  }

  protected compileHeadings(): DesignTemplate['heading'] {
    const { heading } = this.config.typography;
    let l1: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };
    let l2: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };
    let l3: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };
    let l4: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };
    let l5: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };
    let l6: TypographyTemplate = { letterSpacing: 0, lineHeight: 0, size: 0 };

    // Explicit values
    if ('level1' in heading || 'level6' in heading) {
      ({ level1: l1, level2: l2, level3: l3, level4: l4, level5: l5, level6: l6 } = heading);

      // Scaled values
    } else {
      const {
        letterSpacing,
        letterSpacingScale,
        lineHeight,
        lineHeightScale,
        size,
        sizeScale,
      } = heading;

      l1.letterSpacing = letterSpacing;
      l2.letterSpacing = scaleUp(l1.letterSpacing, letterSpacingScale);
      l3.letterSpacing = scaleUp(l2.letterSpacing, letterSpacingScale);
      l4.letterSpacing = scaleUp(l3.letterSpacing, letterSpacingScale);
      l5.letterSpacing = scaleUp(l4.letterSpacing, letterSpacingScale);
      l6.letterSpacing = scaleUp(l5.letterSpacing, letterSpacingScale);

      l1.lineHeight = lineHeight;
      l2.lineHeight = scaleUp(l1.lineHeight, lineHeightScale);
      l3.lineHeight = scaleUp(l2.lineHeight, lineHeightScale);
      l4.lineHeight = scaleUp(l3.lineHeight, lineHeightScale);
      l5.lineHeight = scaleUp(l4.lineHeight, lineHeightScale);
      l6.lineHeight = scaleUp(l5.lineHeight, lineHeightScale);

      l1.size = size;
      l2.size = scaleUp(l1.size, sizeScale);
      l3.size = scaleUp(l2.size, sizeScale);
      l4.size = scaleUp(l3.size, sizeScale);
      l5.size = scaleUp(l4.size, sizeScale);
      l6.size = scaleUp(l5.size, sizeScale);
    }

    return { l1, l2, l3, l4, l5, l6 };
  }

  protected compileDepth(): DesignTemplate['depth'] {
    return { ...DEPTHS };
  }

  protected compileShadows(): DesignTemplate['shadow'] {
    const { shadows } = this.config;
    const tokens: DesignTemplate['shadow'] = {
      xs: { x: 0, y: 0, blur: 0, spread: 0 },
      sm: { x: 0, y: 0, blur: 0, spread: 0 },
      md: { x: 0, y: 0, blur: 0, spread: 0 },
      lg: { x: 0, y: 0, blur: 0, spread: 0 },
      xl: { x: 0, y: 0, blur: 0, spread: 0 },
    };

    // Explicit values
    if ('small' in shadows) {
      const { xsmall: xs, small: sm, medium: md, large: lg, xlarge: xl } = shadows;

      tokens.xs = xs;
      tokens.sm = sm;
      tokens.md = md;
      tokens.lg = lg;
      tokens.xl = xl;

      // Scaled values
    } else {
      const { x, xScale, y, yScale, blur, blurScale, spread, spreadScale } = shadows;
      let lastX = x;
      let lastY = y;
      let lastBlur = blur;
      let lastSpread = spread;

      SHADOW_SIZES.forEach((size) => {
        tokens[size] = {
          x: lastX,
          y: lastY,
          blur: lastBlur,
          spread: lastSpread,
        };

        lastX = scaleUp(lastX, xScale);
        lastY = scaleUp(lastY, yScale);
        lastBlur = scaleUp(lastBlur, blurScale);
        lastSpread = scaleUp(lastSpread, spreadScale);
      });
    }

    return tokens;
  }

  protected compileSpacing(text: DesignTemplate['text']): DesignTemplate['spacing'] {
    const { multipliers, type, unit: baseUnit } = this.config.spacing;
    const unit = type === 'vertical-rhythm' ? text.df.size * text.df.lineHeight : baseUnit;

    return {
      type,
      unit,
      ...multipliers,
    };
  }

  protected compileText(): DesignTemplate['text'] {
    const { text } = this.config.typography;
    let sm: TypographyTemplate = { lineHeight: 0, size: 0 };
    let df: TypographyTemplate = { lineHeight: 0, size: 0 };
    let lg: TypographyTemplate = { lineHeight: 0, size: 0 };

    // Explicit values
    if ('small' in text && 'default' in text && 'large' in text) {
      ({ small: sm, default: df, large: lg } = text);

      // Scaled values
    } else {
      const { lineHeight, lineHeightScale, size, sizeScale } = text;

      sm.lineHeight = scaleDown(lineHeight, lineHeightScale);
      sm.size = scaleDown(size, sizeScale);

      df.lineHeight = lineHeight;
      df.size = size;

      lg.lineHeight = scaleUp(lineHeight, lineHeightScale);
      lg.size = scaleUp(size, sizeScale);
    }

    return { sm, df, lg };
  }

  protected compileTypography(text: DesignTemplate['text']): DesignTemplate['typography'] {
    const { font } = this.config.typography;
    const systemFont = FONT_FAMILIES[`${this.options.platform}-system` as 'web-system'];
    let textFont = '';
    let headingFont = '';
    let monospaceFont = '';
    let localeFonts = {};

    if (font === 'system') {
      textFont = systemFont;
      headingFont = systemFont;
    } else if (typeof font === 'string') {
      textFont = font;
      headingFont = font;
    } else {
      textFont = font.text;
      headingFont = font.heading;
      monospaceFont = font.monospace;
      localeFonts = font.locale;
    }

    return {
      font: {
        heading: quote(headingFont || systemFont),
        locale: localeFonts,
        monospace: quote(monospaceFont),
        text: quote(textFont || systemFont),
        system: quote(systemFont),
      },
      rootLineHeight: text.df.lineHeight,
      rootTextSize: text.df.size,
    };
  }
}
