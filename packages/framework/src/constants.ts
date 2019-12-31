/* eslint-disable sort-keys */

import { DesignConfig, ScaleType, LayerType, BorderSize, BreakpointSize } from './types';

export const BORDER_SIZES: BorderSize[] = ['small', 'normal', 'large'];

export const BREAKPOINT_SIZES: BreakpointSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

export const DEFAULT_BREAKPOINTS: DesignConfig['breakpoints'] = [640, 960, 1280, 1600, 1920];

export const HEADING_LEVELS = 6;

export const LAYERS: { [K in LayerType]: number } = {
  content: 100,
  navigation: 1000,
  menu: 1100,
  sheet: 1200,
  modal: 1300,
  toast: 1400,
  tooltip: 1500,
};

export const SHADOW_LEVELS = 10;

export const SYSTEM_FONT_FAMILY =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

// https://type-scale.com
export const SCALES: { [K in ScaleType]: number } = {
  'augmented-fourth': 1.414,
  'golden-ratio': 1.618,
  'major-second': 1.125,
  'major-third': 1.25,
  'minor-second': 1.067,
  'minor-third': 1.2,
  'perfect-fifth': 1.5,
  'perfect-fourth': 1.333,
};
