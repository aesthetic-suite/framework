import { OutlineProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<OutlineProperty>('outline', (prop, { join, wrap }) =>
  join(wrap(prop.width), prop.style, prop.color),
);
