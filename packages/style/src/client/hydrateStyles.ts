import { arrayLoop, generateHash } from '@aesthetic/utils';
import ClientRenderer from './ClientRenderer';
import {
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
} from '../constants';
import { Condition, CacheItem } from '../types';

// eslint-disable-next-line security/detect-unsafe-regex
const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/iu;

function addRuleToCache(renderer: ClientRenderer, rule: string, cache: Partial<CacheItem>) {
  const [, className, selector = '', property, value] = rule.match(RULE_PATTERN)!;

  renderer.classNameCache.write(property, value.endsWith(';') ? value.slice(0, -1) : value, {
    className,
    conditions: [],
    rank: 0,
    selector: selector.trim(),
    type: 'standard',
    ...cache,
  });
}

export function hydrateGlobals(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule) => {
    if (rule.type === FONT_FACE_RULE || rule.type === KEYFRAMES_RULE || rule.type === IMPORT_RULE) {
      renderer.ruleCache[generateHash(rule.cssText)] = true;
    }
  });
}

export function hydrateRules(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule, rank) => {
    if (rule.type === STYLE_RULE) {
      addRuleToCache(renderer, rule.cssText, {
        rank,
        type: 'standard',
      });
    }
  });
}

export function hydrateConditions(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (rule: CSSConditionRule, conditions: Condition[] = []) => {
    conditions.unshift({
      query: rule.conditionText || (rule as CSSMediaRule).media.mediaText,
      type: rule.type,
    });

    arrayLoop(rule.cssRules, (child) => {
      if (child.type === STYLE_RULE) {
        addRuleToCache(renderer, child.cssText, {
          conditions,
          rank,
          type: 'conditions',
        });
      } else if (child.type === MEDIA_RULE || child.type === SUPPORTS_RULE) {
        gatherStack(child as CSSConditionRule, conditions);
      }
    });
  };

  arrayLoop(sheet.cssRules, (rule, currentRank) => {
    if (rule.type === MEDIA_RULE || rule.type === SUPPORTS_RULE) {
      rank = currentRank;

      gatherStack(rule as CSSConditionRule);
    }
  });
}
