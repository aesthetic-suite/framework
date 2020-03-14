import { ColumnRuleProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<ColumnRuleProperty>('columnRule', (prop, { join, wrap }) =>
  join(wrap(prop.width), prop.style, prop.color),
);
