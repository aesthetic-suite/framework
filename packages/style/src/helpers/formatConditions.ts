import { MEDIA_RULE } from '../constants';
import { Condition } from '../types';

export default function formatConditions(rule: string, conditions: Condition[]): string {
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
