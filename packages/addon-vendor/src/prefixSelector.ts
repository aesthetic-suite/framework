import { CSS } from '@aesthetic/types';
import { selectorMapping } from './data';
import getPrefixesFromMask from './getPrefixesFromMask';

export default function prefixSelector(selector: string, rule: CSS): CSS {
  const mask = selectorMapping[selector];
  let output = '';

  getPrefixesFromMask(mask).forEach((prefix) => {
    let prefixedSelector = selector;

    if (selector.startsWith('::')) {
      prefixedSelector = `::${prefix}${selector.slice(2)}`;
    } else if (selector.startsWith(':')) {
      prefixedSelector = `:${prefix}${selector.slice(1)}`;
    }

    output += rule.replace(selector, prefixedSelector);
  });

  // Base rule must be last
  output += rule;

  return output;
}
