import { OffsetProperty } from '../types';
import { divide, join } from '../transform';

export default function transformOffset(prop: OffsetProperty): string {
  let part = join(prop.path, prop.distance || prop.rotate);

  if (prop.position) {
    part = join(prop.position, part);
  } else {
    return '';
  }

  return divide(part, prop.anchor);
}
