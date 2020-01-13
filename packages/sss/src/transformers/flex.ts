import { FlexProperty } from '../types';
import { join } from '../transform';

export default function transformFlex(prop: FlexProperty): string {
  return join(prop.grow, prop.shrink, prop.basis);
}
