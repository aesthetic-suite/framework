import { arrayLoop, generateHash } from '@aesthetic/utils';
import ClientRenderer from './ClientRenderer';
import addRuleToCache from './addRuleToCache';
import {
  FONT_FACE_RULE,
  KEYFRAMES_RULE,
  IMPORT_RULE,
  STYLE_RULE,
  MEDIA_RULE,
  SUPPORTS_RULE,
} from '../constants';
import { Condition, SheetType } from '../types';

function hydrateGlobals(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, rule => {
    if (rule.type === FONT_FACE_RULE || rule.type === KEYFRAMES_RULE || rule.type === IMPORT_RULE) {
      renderer.atRuleCache[generateHash(rule.cssText)] = true;
    }
  });
}

function hydrateRules(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  arrayLoop(sheet.cssRules, (rule, rank) => {
    if (rule.type === STYLE_RULE) {
      addRuleToCache(renderer, rule.cssText, {
        rank,
        type: 'standard',
      });
    }
  });
}

function hydrateConditions(renderer: ClientRenderer, sheet: CSSStyleSheet) {
  let rank = 0;

  const gatherStack = (rule: CSSConditionRule, conditions: Condition[] = []) => {
    conditions.unshift({
      query: rule.conditionText || (rule as CSSMediaRule).media.mediaText,
      type: rule.type,
    });

    arrayLoop(rule.cssRules, child => {
      if (child.type === STYLE_RULE) {
        addRuleToCache(renderer, child.cssText, {
          conditions,
          rank,
          type: 'conditions',
        });

        rank += 1;
      } else if (child.type === MEDIA_RULE || child.type === SUPPORTS_RULE) {
        gatherStack(child as CSSConditionRule, conditions);
      }
    });
  };

  arrayLoop(sheet.cssRules, rule => {
    if (rule.type === MEDIA_RULE || rule.type === SUPPORTS_RULE) {
      gatherStack(rule as CSSConditionRule);
    }
  });
}

export default function hydrate(renderer: ClientRenderer) {
  arrayLoop(document.querySelectorAll<HTMLStyleElement>('style[data-aesthetic-hydrate]'), style => {
    const sheet = style.sheet as CSSStyleSheet;
    const type = style.getAttribute('data-aesthetic-type') as SheetType;

    if (type === 'global') {
      hydrateGlobals(renderer, sheet);
    } else if (type === 'standard') {
      hydrateRules(renderer, sheet);
    } else if (type === 'conditions') {
      hydrateConditions(renderer, sheet);
    }

    // Persist the rule index
    renderer.ruleIndex = Number(style.getAttribute('data-aesthetic-hydrate'));

    // Disable so that we avoid unnecessary hydration
    style.removeAttribute('data-aesthetic-hydrate');
  });
}
