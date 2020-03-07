import { OffsetProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<OffsetProperty>('offset', (prop, { join, separate }) => {
  let part = join(prop.path, prop.distance || prop.rotate);

  if (prop.position) {
    part = join(prop.position, part);
  }

  if (prop.anchor) {
    return separate(part, prop.anchor);
  }

  return part;
});
