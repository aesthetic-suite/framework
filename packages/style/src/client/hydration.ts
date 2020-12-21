/* eslint-disable require-unicode-regexp */

import { arrayLoop } from '@aesthetic/utils';
import { createCacheKey } from '../common/cache';
import {
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
} from '../common/constants';
import { joinQueries } from '../common/helpers';
import { StyleEngine } from '../types';

// eslint-disable-next-line
const RULE_PATTERN = /^\.(\w+)((?::|\[|>|~|\+|\*)[^{]+)?\s*\{\s*([^:]+):\s*([^}]+)\s*\}$/i;
const FONT_FAMILY = /font-family:([^;]+)/;
const IMPORT_URL = /url\(["']?([^)]+)["']?\)/;

function addRuleToCache(
  engine: StyleEngine,
  rule: string,
  rank: number,
  media: string = '',
  supports: string = '',
) {
  const [, className, rawSelector = '', property, rawValue] = rule.match(RULE_PATTERN)!;
  // Has trailing spaces
  const selector = rawSelector.trim();
  // Has trailing semi-colon
  const value = rawValue.slice(0, -1);

  engine.cacheManager.write(
    createCacheKey(property, value, {
      media,
      selector,
      supports,
    }),
    {
      className,
      rank,
    },
  );
}

function hydrate(engine: StyleEngine, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (
    rule: CSSConditionRule,
    prevMedia: string = '',
    prevSupports: string = '',
  ) => {
    const condition = rule.conditionText || (rule as CSSMediaRule).media.mediaText;
    let media = prevMedia;
    let supports = prevSupports;

    if (rule.type === MEDIA_RULE) {
      media = joinQueries(media, condition);
    } else if (rule.type === SUPPORTS_RULE) {
      supports = joinQueries(supports, condition);
    }

    arrayLoop(rule.cssRules, (child) => {
      if (child.type === STYLE_RULE) {
        addRuleToCache(engine, child.cssText, rank, media, supports);
      } else if (child.type === MEDIA_RULE || child.type === SUPPORTS_RULE) {
        gatherStack(child as CSSConditionRule, media, supports);
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
        cacheKey = fontFamilyName[1].trim();
      }
    } else if (rule.type === KEYFRAMES_RULE) {
      cacheKey = css.slice(0, css.indexOf('{')).replace('@keyframes', '').trim();
    } else if (rule.type === IMPORT_RULE) {
      const importPath = css.match(IMPORT_URL);

      if (importPath) {
        [cacheKey] = importPath;
      }
    }

    if (cacheKey) {
      engine.cacheManager.write(cacheKey, { className: '' });
    }
  });
}

export function hydrateStyles(engine: StyleEngine): boolean {
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
