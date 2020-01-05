import { TransitionProperty } from '../types';
import { join } from '../transformProperty';

export default function transformTransition(prop: TransitionProperty): string {
  return join(prop.property, prop.duration, prop.timingFunction, prop.delay);
}
