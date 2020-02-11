import { MarginProperty, PaddingProperty } from '../types';
import { join } from '../transform';

export default function transformGenericSpacing(prop: MarginProperty | PaddingProperty): string {
  if (prop.topBottom && prop.leftRight) {
    return join(prop.topBottom, prop.leftRight);
  }

  if (prop.top && prop.leftRight && prop.bottom) {
    return join(prop.top, prop.leftRight, prop.bottom);
  }

  return join(prop.top, prop.right, prop.bottom, prop.left);
}
