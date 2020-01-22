import { ElevationType } from './types';

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
