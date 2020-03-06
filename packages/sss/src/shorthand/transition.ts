import { TransitionProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<TransitionProperty>('transition', (prop, { join }) =>
  join(prop.property, prop.duration, prop.timingFunction, prop.delay),
);
