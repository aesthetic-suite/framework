import { BorderProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<BorderProperty>('border', (prop, { join, wrap }) =>
  join(wrap(prop.width), prop.style, prop.color),
);
