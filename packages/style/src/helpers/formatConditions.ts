import { MEDIA_RULE } from '../constants';
import { Condition } from '../types';

export default function formatConditions(rule: string, conditions: Condition[]): string {
  return conditions
    .reverse()
    .reduce(
      (tempRule, condition) =>
        `@${condition.type === MEDIA_RULE ? 'media' : 'supports'} ${
          condition.query
        } { ${tempRule} }`,
      rule,
    );
}
