import { Direction } from '../types';

export default function isRTL(dir: Direction): boolean {
  return dir === 'rtl';
}
