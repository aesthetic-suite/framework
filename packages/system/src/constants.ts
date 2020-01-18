import { LayerType } from './types';

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
