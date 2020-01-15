import {
  BorderSize,
  BreakpointSize,
  LayerType,
  ShadowSize,
  SpacingSize,
  HeadingSize,
  TextSize,
} from '@aesthetic/system';
import { ScaleType, BreakpointListConfig } from './types';

export const BORDER_SIZES: BorderSize[] = ['sm', 'df', 'lg'];

export const BREAKPOINT_SIZES: BreakpointSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const DEFAULT_BREAKPOINTS: BreakpointListConfig = [640, 960, 1280, 1600, 1920];

export const DEFAULT_UNIT = 8;

export const FONT_FAMILIES = {
  android: 'sans-serif',
  ios: 'SF Pro',
  web:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

export const HEADING_LEVELS: HeadingSize[] = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'];

export const LAYERS: { [K in LayerType]: string | number } = {
  auto: 'auto',
  hide: -1,
  base: 0,
  content: 100,
  navigation: 1000,
  menu: 1100,
  sheet: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

export const LAYER_LEVELS = Object.keys(LAYERS);

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
