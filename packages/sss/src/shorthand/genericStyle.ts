import { BorderProperty, ColumnRuleProperty, OutlineProperty } from '../types';
import { join } from '../transform';

export default function transformGenericStyle(
  prop: BorderProperty | ColumnRuleProperty | OutlineProperty,
): string {
  return join(prop.width, prop.style, prop.color);
}
