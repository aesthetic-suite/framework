import { arrayLoop, generateHash } from '@aesthetic/utils';
import {
  createCacheKey,
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
  Condition,
  SheetType,
  StyleEngine,
} from '../index';

// eslint-disable-next-line
const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/i;

function addRuleToCache(
  engine: StyleEngine,
  rule: string,
  rank: number,
  conditions: Condition[] = [],
) {
  const [, className, selector = '', property, value] = rule.match(RULE_PATTERN)!;
  const cacheKey = createCacheKey(
    property,
    // Has trailing semi-colon
    value.slice(0, -1),
    {
      conditions,
      // Has trailing spaces
      selector: selector.trim(),
    },
  );

  engine.cacheManager.write(cacheKey, {
    className,
    rank,
  });
}

function hydrateGlobals(engine: StyleEngine, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule) => {
    if (rule.type === FONT_FACE_RULE || rule.type === KEYFRAMES_RULE || rule.type === IMPORT_RULE) {
      engine.cacheManager.write(rule.cssText, { className: generateHash(rule.cssText) });
    }
  });
}

function hydrateRules(engine: StyleEngine, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule, rank) => {
    if (rule.type === STYLE_RULE) {
      addRuleToCache(engine, rule.cssText, rank);
    }
  });
}

function hydrateConditions(engine: StyleEngine, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (rule: CSSConditionRule, conditions: Condition[] = []) => {
    conditions.unshift(
      `@${rule.type === MEDIA_RULE ? 'media' : 'supports'} ${
        rule.conditionText || (rule as CSSMediaRule).media.mediaText
      }`,
    );

    arrayLoop(rule.cssRules, (child) => {
      if (child.type === STYLE_RULE) {
        addRuleToCache(engine, child.cssText, rank, conditions);
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

export default function hydrateStyles(engine: StyleEngine): boolean {
  const styles = document.querySelectorAll<HTMLStyleElement>('style[data-aesthetic-hydrate-index]');

  arrayLoop(styles, (style) => {
    const sheet = style.sheet as CSSStyleSheet;
    const type = style.getAttribute('data-aesthetic-type') as SheetType;

    if (type === 'global') {
      hydrateGlobals(engine, sheet);
    } else if (type === 'conditions') {
      hydrateConditions(engine, sheet);
    } else {
      hydrateRules(engine, sheet);
    }

    if (engine.ruleIndex === -1) {
      engine.ruleIndex = Number(style.getAttribute('data-aesthetic-rule-index'));
    }

    // Disable so that we avoid unnecessary hydration
    style.removeAttribute('data-aesthetic-hydrate-index');
    style.removeAttribute('data-aesthetic-rule-index');
  });

  return styles.length > 0;
}
