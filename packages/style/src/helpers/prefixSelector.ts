import getPrefixesFromMask from './getPrefixesFromMask';
import { selectorMapping } from '../data/prefixes';

export default function prefixSelector(selector: string, rule: string): string {
  const mask = selectorMapping[selector];
  let output = '';

  getPrefixesFromMask(mask).forEach((prefix) => {
    let prefixedSelector = '';

    if (selector.startsWith('::')) {
      prefixedSelector = `::${prefix}${selector.slice(2)}`;
    } else if (selector.startsWith(':')) {
      prefixedSelector = `:${prefix}${selector.slice(1)}`;
    } else {
      return;
    }

    output += rule.replace(selector, prefixedSelector);
  });

  // Base rule must be last
  output += rule;

  return output;
}
