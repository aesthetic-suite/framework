/* eslint-disable require-unicode-regexp */

import { arrayLoop } from '@aesthetic/utils';
// Rollup compatibility
import {
  createCacheKey,
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
  Condition,
  StyleEngine,
} from '../index';

// eslint-disable-next-line
const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/i;
const FONT_FAMILY = /font-family:([^;]+)/;
const IMPORT_URL = /url\(["']?([^)]+)["']?\)/;

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

function hydrate(engine: StyleEngine, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (rule: CSSConditionRule, conditions: Condition[] = []) => {
    conditions.push(
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
    // Standard
    if (rule.type === STYLE_RULE) {
      if (!rule.cssText.startsWith(':root')) {
        addRuleToCache(engine, rule.cssText, currentRank);
      }

      return;
    }

    // Conditions
    if (rule.type === MEDIA_RULE || rule.type === SUPPORTS_RULE) {
      rank = currentRank;
      gatherStack(rule as CSSConditionRule);

      return;
    }

    // Globals
    const css = rule.cssText;
    let cacheKey = '';

    if (rule.type === FONT_FACE_RULE) {
      const fontFamilyName = css.match(FONT_FAMILY);

      if (fontFamilyName) {
        cacheKey = `@font-face:${fontFamilyName[1].trim()}`;
      }
    } else if (rule.type === KEYFRAMES_RULE) {
      cacheKey = css.slice(0, css.indexOf('{')).replace(' ', ':').trim();
    } else if (rule.type === IMPORT_RULE) {
      const importPath = css.match(IMPORT_URL);

      if (importPath) {
        cacheKey = `@import:${importPath[1]}`;
      }
    }

    if (cacheKey) {
      engine.cacheManager.write(cacheKey, { className: '' });
    }
  });
}

export default function hydrateStyles(engine: StyleEngine): boolean {
  const styles = document.querySelectorAll<HTMLStyleElement>('style[data-aesthetic-hydrate-index]');

  arrayLoop(styles, (style) => {
    hydrate(engine, style.sheet as CSSStyleSheet);

    if (engine.ruleIndex === -1) {
      engine.ruleIndex = Number(style.getAttribute('data-aesthetic-rule-index'));
    }

    // Remove so that we avoid unnecessary hydration
    style.removeAttribute('data-aesthetic-hydrate-index');
    style.removeAttribute('data-aesthetic-rule-index');
  });

  return styles.length > 0;
}
