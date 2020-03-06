import { FontProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<FontProperty>('font', (prop, { join, separate, wrap }) => {
  if (prop.system) {
    return prop.system;
  }

  return join(
    prop.style,
    prop.variant,
    prop.weight,
    prop.stretch,
    separate(wrap(prop.size), prop.lineHeight),
    prop.family,
  );
});
