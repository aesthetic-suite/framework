/* eslint-disable no-param-reassign */

import toArray from './toArray';

type RulesContainer = CSSStyleSheet | CSSGroupingRule;

// Only matches global elements
const NON_GLOBAL_PREFIX = /^(#|\.|@)/u;

function containsNestedRules(rule: unknown): rule is RulesContainer {
  return (
    (typeof CSSStyleSheet !== 'undefined' && rule instanceof CSSStyleSheet) ||
    (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule) ||
    (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule)
  );
}

function deleteRule(parent: RulesContainer, ruleToDelete: CSSRule) {
  Array.from(parent.cssRules).some((rule, index) => {
    if (rule === ruleToDelete && parent.cssRules[index]) {
      if (typeof parent.deleteRule === 'function') {
        parent.deleteRule(index);
      } else {
        delete parent.cssRules[index];
      }

      return true;
    }

    return false;
  });

  // CSSOM doesn't implement deleteRule(), so we delete the rule by index above.
  // Now we need to filter out the empty values or other features crash.
  if (process.env.NODE_ENV === 'test') {
    // @ts-ignore
    parent.cssRules = parent.cssRules.filter(Boolean);
  }

  // Remove this rule from the parent if there are no more child rules
  if (parent.cssRules.length === 0 && parent instanceof CSSRule) {
    if (containsNestedRules(parent.parentRule)) {
      deleteRule(parent.parentRule, parent);
    }

    if (containsNestedRules(parent.parentStyleSheet)) {
      deleteRule(parent.parentStyleSheet, parent);
    }
  }
}

function purgeRules(parent: RulesContainer, onlyGlobals: boolean = false) {
  if (!parent.cssRules) {
    return;
  }

  const rulesToDelete: CSSRule[] = [];

  // First pass to gather rules to delete. We can't delete rules within this
  // loop as indices are reset each deletion, so subsequent deletions would be
  // deleting the wrong indices. Sadly we have to do multiple passes and loops.
  Array.from(parent.cssRules).forEach(rule => {
    if (containsNestedRules(rule)) {
      purgeRules(rule);
    }

    if (onlyGlobals && NON_GLOBAL_PREFIX.test(rule.cssText)) {
      return;
    }

    rulesToDelete.push(rule);
  });

  // Second pass to actually delete the rules!
  rulesToDelete.forEach(rule => {
    deleteRule(parent, rule);
  });
}

export default function purgeStyles(
  styles: HTMLStyleElement | HTMLStyleElement[],
  onlyGlobals: boolean = false,
) {
  toArray(styles).forEach(style => {
    style.textContent = '';

    if (containsNestedRules(style.sheet)) {
      purgeRules(style.sheet, onlyGlobals);
    }
  });
}
