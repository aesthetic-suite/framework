import { AnimationProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<AnimationProperty>('animation', (prop, { join }) =>
  join(
    prop.duration,
    prop.timingFunction,
    prop.delay,
    prop.iterationCount,
    prop.direction,
    prop.fillMode,
    prop.playState,
    prop.name,
  ),
);
