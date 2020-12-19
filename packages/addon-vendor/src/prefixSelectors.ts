import { CSS } from '@aesthetic/types';
import getPrefixesFromMask from './getPrefixesFromMask';
import { selectorMapping } from './data';

export function prefixSelector(selector: string, rule: CSS): CSS {
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

export default function prefixSelectors(selectors: string[], rule: CSS): CSS {
  return selectors.reduce((css, selector) => prefixSelector(selector, css), rule);
}
