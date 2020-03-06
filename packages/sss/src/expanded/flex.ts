import { FlexProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<FlexProperty>('flex', (prop, { join, wrap }) =>
  join(prop.grow, prop.shrink, wrap(prop.basis)),
);
