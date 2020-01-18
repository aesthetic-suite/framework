import { LAYERS } from '@aesthetic/system';
import SystemTheme from './SystemTheme';
import { font as getFont } from './helpers';
import { SCALES, BREAKPOINT_SIZES } from './constants';
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

export default class System {
  readonly template: DesignTemplate;

  private readonly config: DesignConfig;

  private readonly options: SystemOptions;

  constructor(config: DesignConfig, options: SystemOptions) {
    this.config = config;
    this.options = options;
    this.template = this.compile();
  }

  createTheme(config: ThemeConfig): SystemTheme {
    return new SystemTheme(config, this.template);
  }

  protected compile(): DesignTemplate {
    const text = this.compileText();

    return {
      border: this.compileBorders(),
      breakpoint: this.compileBreakpoints(text),
      heading: this.compileHeadings(),
      layer: this.compileLayers(),
      shadow: this.compileShadows(),
      spacing: this.compileSpacing(),
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
    const { breakpoints, lineHeightScale, textScale, strategy } = responsive;
    const points: number[] = [];

    if (Array.isArray(breakpoints)) {
      points.push(...breakpoints);
    } else {
      points.push(...Object.values(breakpoints));
    }

    // Sort mobile ASC, desktop DESC
    points.sort((a, b) => (strategy === 'mobile-first' ? a - b : b - a));

    // Map a list of template objects
    let lastLineHeight = text.df.lineHeight;
    let lastTextSize = text.df.size;

    const templates: BreakpointTemplate[] = BREAKPOINT_SIZES.map((name, index) => {
      const size = points[index];
      const conditions: BreakpointCondition[] = [];

      if (strategy === 'mobile-first') {
        conditions.push(['min-width', size]);

        const next = points[index + 1];

        if (next) {
          conditions.push(['max-width', next - 1]);
        }

        lastLineHeight = scaleUp(lastLineHeight, lineHeightScale);
        lastTextSize = scaleUp(lastTextSize, textScale);
      } else {
        const prev = points[index - 1];

        if (prev) {
          conditions.push(['min-width', prev + 1]);
        }

        conditions.push(['max-width', size]);

        lastLineHeight = scaleDown(lastLineHeight, lineHeightScale);
        lastTextSize = scaleDown(lastTextSize, textScale);
      }

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

  protected compileLayers(): DesignTemplate['layer'] {
    return { ...LAYERS };
  }

  protected compileShadows(): DesignTemplate['shadow'] {
    // @ts-ignore TODO
    return {};
  }

  protected compileSpacing(): DesignTemplate['spacing'] {
    // These are multipliers, not the actual values
    return {
      xs: 0.25,
      sm: 0.5,
      df: 1,
      md: 2,
      lg: 3,
      xl: 4,
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
    const systemFont = getFont(this.options.platform, 'system');
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
        heading: headingFont || systemFont,
        locale: localeFonts,
        monospace: monospaceFont || getFont(this.options.platform, 'monospace'),
        text: textFont || systemFont,
        system: systemFont,
      },
      rootLineHeight: text.df.lineHeight,
      rootTextSize: text.df.size,
    };
  }
}
