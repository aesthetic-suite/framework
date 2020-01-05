import { AnimationProperty } from '../types';
import { join } from '../transformProperty';

export default function transformAnimation(prop: AnimationProperty): string {
  return join(
    prop.duration,
    prop.timingFunction,
    prop.delay,
    prop.iterationCount,
    prop.direction,
    prop.fillMode,
    prop.playState,
    prop.name,
  );
}
