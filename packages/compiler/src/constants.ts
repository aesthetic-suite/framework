import {
  BorderSize,
  BreakpointSize,
  ShadowSize,
  SpacingSize,
  HeadingSize,
  TextSize,
  PaletteType,
  ColorShade,
} from '@aesthetic/system';
import { ScaleType, BreakpointListConfig } from './types';

export const NAME_PATTERN = /^[-a-z0-9]+$/giu;

export const CONFIG_FOLDER = '.aesthetic';

export const BRAND_FILE = 'brand.yaml';

export const LANGUAGE_FILE = 'language.yaml';

export const THEMES_FILE = 'themes.yaml';

export const BORDER_SIZES: BorderSize[] = ['sm', 'df', 'lg'];

export const BREAKPOINT_SIZES: BreakpointSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const DEFAULT_BREAKPOINTS: BreakpointListConfig = [640, 960, 1280, 1600, 1920];

export const DEFAULT_UNIT = 8;

export const FONT_FAMILIES = {
  'android-monospace': 'monospace',
  'android-system': 'sans-serif',
  'ios-monospace': 'Menlo-Regular',
  'ios-system': 'SF Pro',
  'web-monospace': '"Lucida Console", Monaco, monospace',
  'web-system':
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

export const HEADING_SIZES: HeadingSize[] = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];

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
  'success',
  'info',
];

export const SHADE_RANGES: ColorShade[] = [
  '00',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
];
