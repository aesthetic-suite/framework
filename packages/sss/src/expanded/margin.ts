import { MarginProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<MarginProperty>('margin', (prop, { join, wrap }) => {
  if (prop.topBottom && prop.leftRight) {
    return join(wrap(prop.topBottom), wrap(prop.leftRight));
  }

  if (prop.top && prop.leftRight && prop.bottom) {
    return join(wrap(prop.top), wrap(prop.leftRight), wrap(prop.bottom));
  }

  return join(wrap(prop.top), wrap(prop.right), wrap(prop.bottom), wrap(prop.left));
});
