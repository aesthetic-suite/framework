import { CSS } from '@aesthetic/types';
import { arrayLoop } from '@aesthetic/utils';
import { Condition } from '../types';

export default function formatConditions(rule: CSS, conditions: Condition[] = []): CSS {
  let css = rule;

  arrayLoop(
    conditions,
    (condition) => {
      css = `${condition} { ${css} }`;
    },
    true,
  );

  return css;
}
