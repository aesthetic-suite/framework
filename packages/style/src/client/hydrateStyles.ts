import { arrayLoop, generateHash } from '@aesthetic/utils';
import createAtomicCacheKey from '../helpers/createAtomicCacheKey';
import ClientRenderer from './ClientRenderer';
import {
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
} from '../constants';
import { Condition } from '../types';

const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/iu;

function addRuleToCache(
  renderer: ClientRenderer,
  rule: string,
  rank: number,
  conditions: Condition[] = [],
) {
  const [, className, selector = '', property, value] = rule.match(RULE_PATTERN)!;
  const cacheKey = createAtomicCacheKey(
    {
      conditions,
      selector: selector.trim(),
    },
    property,
    value,
  );

  renderer.cache.write(cacheKey, {
    className,
    rank,
  });
}

export function hydrateGlobals(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule) => {
    if (rule.type === FONT_FACE_RULE || rule.type === KEYFRAMES_RULE || rule.type === IMPORT_RULE) {
      const hash = generateHash(rule.cssText);

      renderer.cache.write(hash, { className: hash });
    }
  });
}

export function hydrateRules(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule, rank) => {
    if (rule.type === STYLE_RULE) {
      addRuleToCache(renderer, rule.cssText, rank);
    }
  });
}

export function hydrateConditions(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (rule: CSSConditionRule, conditions: Condition[] = []) => {
    conditions.unshift(
      `@${rule.type === MEDIA_RULE ? 'media' : 'supports'} ${
        rule.conditionText || (rule as CSSMediaRule).media.mediaText
      }`,
    );

    arrayLoop(rule.cssRules, (child) => {
      if (child.type === STYLE_RULE) {
        addRuleToCache(renderer, child.cssText, rank, conditions);
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
