import { ElevationType } from './types';

export const DEPTHS: { [K in ElevationType]: number } = {
  content: 100, // xs
  navigation: 1000, // sm
  menu: 1100, // md
  sheet: 1200, // lg
  overlay: 1300, // lg
  modal: 1400, // xl
  popover: 1500, // md
  toast: 1600, // md
  tooltip: 1700, // sm
};
