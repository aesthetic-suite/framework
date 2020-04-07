import { arrayLoop, objectLoop, isSSR } from '@aesthetic/utils';
import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import formatVariableName from '../helpers/formatVariableName';
import getDocumentStyleSheet from '../helpers/getDocumentStyleSheet';
import { hydrateGlobals, hydrateRules, hydrateConditions } from './hydrateStyles';
import { SheetType, StyleRule, CSSVariables } from '../types';

function getSheet(type: SheetType): StyleRule {
  return (getDocumentStyleSheet(type) as unknown) as StyleRule;
}

export default class ClientRenderer extends Renderer {
  conditionsStyleSheet = new ConditionsStyleSheet(getSheet('conditions'));

  globalStyleSheet = new GlobalStyleSheet(getSheet('global'));

  standardStyleSheet = new StandardStyleSheet(getSheet('standard'));

  applyRootVariables(vars: CSSVariables) {
    if (isSSR()) {
      return;
    }

    const root = document.documentElement;

    objectLoop(vars, (value, key) => {
      root.style.setProperty(formatVariableName(key), String(value));
    });
  }

  hydrateStyles() {
    if (isSSR()) {
      return;
    }

    arrayLoop(
      document.querySelectorAll<HTMLStyleElement>('style[data-aesthetic-hydrate-index]'),
      (style) => {
        const sheet = style.sheet as CSSStyleSheet;
        const type = style.getAttribute('data-aesthetic-type') as SheetType;
        const lastIndex = Number(style.getAttribute('data-aesthetic-hydrate-index'));

        switch (type) {
          case 'global':
            hydrateGlobals(this, sheet);
            this.globalStyleSheet.lastIndex = lastIndex;
            break;

          case 'conditions':
            hydrateConditions(this, sheet);
            this.conditionsStyleSheet.lastIndex = lastIndex;
            break;

          default:
            hydrateRules(this, sheet);
            this.standardStyleSheet.lastIndex = lastIndex;
            break;
        }

        // Persist the rule index
        if (this.ruleIndex === -1) {
          this.ruleIndex = Number(style.getAttribute('data-aesthetic-rule-index'));
        }

        // Disable so that we avoid unnecessary hydration
        style.removeAttribute('data-aesthetic-hydrate-index');
        style.removeAttribute('data-aesthetic-rule-index');
      },
    );
  }
}
