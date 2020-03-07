import { TextDecorationProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<TextDecorationProperty>('textDecoration', (prop, { join, wrap }) =>
  join(prop.line, prop.style, prop.color, wrap(prop.thickness)),
);
