import { ColorShade, ElevationType, PaletteType } from './types';

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
];
