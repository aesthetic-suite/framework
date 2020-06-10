import { CSS } from '@aesthetic/types';
import { MEDIA_RULE } from '../constants';
import { Condition } from '../types';

export default function formatConditions(rule: CSS, conditions: Condition[]): CSS {
  return conditions
    .reverse()
    .reduce(
      (innerRule, condition) =>
        `@${condition.type === MEDIA_RULE ? 'media' : 'supports'} ${
          condition.query
        } { ${innerRule} }`,
      rule,
    );
}
