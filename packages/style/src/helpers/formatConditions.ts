import { CSS } from '@aesthetic/types';
import { arrayLoop } from '@aesthetic/utils';
import { MEDIA_RULE } from '../constants';
import { Condition } from '../types';

export default function formatConditions(rule: CSS, conditions: Condition[]): CSS {
  let css = rule;

  arrayLoop(
    conditions,
    (condition) => {
      css = `@${condition.type === MEDIA_RULE ? 'media' : 'supports'} ${
        condition.query
      } { ${css} }`;
    },
    true,
  );

  return css;
}
