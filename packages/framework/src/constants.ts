import { Config, ScaleType } from './types';

export const DEFAULT_BREAKPOINTS: Config['breakpoints'] = [0, 600, 960, 1280, 1920];

export const SYSTEM_FONT_FAMILY = '';

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
