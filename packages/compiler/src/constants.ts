import {
  BorderSize,
  BreakpointSize,
  CommonSize,
  DEPTHS,
  HeadingSize,
  PaletteType,
  SHADE_RANGES,
  ShadowSize,
  SpacingSize,
  StateType,
  TextSize,
} from '@aesthetic/system';
import { BreakpointListConfig, ScaleType } from './types';

export const NAME_PATTERN = /^[-a-z0-9]+$/giu;

export const CONFIG_FOLDER = '.aesthetic';

export const BRAND_FILE = 'brand.yaml';

export const LANGUAGE_FILE = 'language.yaml';

export const THEMES_FILE = 'themes.yaml';

export const DEFAULT_BREAKPOINTS: BreakpointListConfig = [640, 960, 1280, 1600, 1920];

export const DEFAULT_UNIT = 8;

export const FONT_FAMILIES = {
  'android-monospace': 'monospace',
  'android-system': 'sans-serif',
  'ios-monospace': 'Menlo-Regular',
  'ios-system': 'SF Pro',
  'web-monospace':
    'Menlo, Monaco, Consolas, "Lucida Console", "Liberation Mono", "Courier New", monospace',
  'web-system':
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

// https://learnui.design/blog/ultimate-guide-font-sizes-ui-design.html
export const PLATFORM_CONFIGS = {
  android: {
    baseFontSize: 14,
    fontUnit: 'sp',
    spacingUnit: 'dp',
  },
  ios: {
    baseFontSize: 17,
    fontUnit: 'pt',
    spacingUnit: 'pt', // ???
  },
  web: {
    baseFontSize: 16,
    fontUnit: 'px',
    spacingUnit: 'rem',
  },
};

// https://type-scale.com
export const SCALES: { [K in ScaleType]: number } = {
  'augmented-fourth': 1.414,
  'double-octave': 4,
  'golden-ratio': 1.618,
  'golden-section': 1.618,
  'major-second': 1.125,
  'major-third': 1.25,
  'major-sixth': 1.667,
  'major-seventh': 1.875,
  'major-tenth': 2.5,
  'major-eleventh': 2.667,
  'major-twelfth': 3,
  'minor-second': 1.067,
  'minor-third': 1.2,
  'minor-sixth': 1.6,
  'minor-seventh': 1.778,
  octave: 2,
  'perfect-fifth': 1.5,
  'perfect-fourth': 1.333,
};

// SYSTEM

export { DEPTHS, SHADE_RANGES };

export const BORDER_SIZES: BorderSize[] = ['sm', 'df', 'lg'];

export const BREAKPOINT_SIZES: BreakpointSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const COMMON_SIZES: CommonSize[] = ['sm', 'df', 'lg'];

export const HEADING_SIZES: HeadingSize[] = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];

export const SHADOW_SIZES: ShadowSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const SPACING_SIZES: SpacingSize[] = ['xs', 'sm', 'df', 'md', 'lg', 'xl'];

export const TEXT_SIZES: TextSize[] = ['sm', 'df', 'lg'];

export const PALETTE_TYPES: PaletteType[] = [
  'brand',
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'muted',
  'danger',
  'warning',
  'negative',
  'positive',
  'info',
];

export const STATE_ORDER: StateType[] = ['focused', 'hovered', 'selected', 'disabled'];

export const SHADE_TEXT = 80;
export const SHADE_BASE = 40;
export const SHADE_FOCUSED = 50;
export const SHADE_HOVERED = 60;
export const SHADE_SELECTED = 50;
export const SHADE_DISABLED = 30;

export const INHERIT_SETTING = 'INHERIT';
