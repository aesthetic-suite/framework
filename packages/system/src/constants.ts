import { ElevationType, ColorShade } from './types';

export const DEPTHS: { [K in ElevationType]: number } = {
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

export const LAYOUT_SHADES: { [key: string]: ColorShade } = {
  document: '00',
  box: '10',
  boxHover: '20',
  border: '30',
  borderHover: '40',
  text: '80',
  shadow: '90',
};
