import { PlatformType } from './types';
import { FONT_FAMILIES } from './constants';

export function font(platform: PlatformType, type: 'monospace' | 'system') {
  return FONT_FAMILIES[`${platform}-${type}` as 'web-system'];
}
