import { ListStyleProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<ListStyleProperty>('listStyle', (prop, { join }) =>
  join(prop.type, prop.position, prop.image),
);
