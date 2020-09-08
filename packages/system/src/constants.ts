import {
  BorderSize,
  BreakpointSize,
  ElevationType,
  HeadingSize,
  ShadowSize,
  SpacingSize,
  TextSize,
  PaletteType,
  ColorShade,
  StateType,
} from './types';

export const BORDER_SIZES: BorderSize[] = ['sm', 'df', 'lg'];

export const BREAKPOINT_SIZES: BreakpointSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const DEPTHS: Record<ElevationType, number> = {
  content: 100, // xs
  navigation: 1000, // sm
  sheet: 1100, // lg
  overlay: 1200, // lg
  modal: 1300, // xl
  toast: 1400, // md
  dialog: 1500, // md
  menu: 1600, // md
  tooltip: 1700, // sm
};

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
  'failure',
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

export const STATE_ORDER: StateType[] = ['focused', 'hovered', 'selected', 'disabled'];
