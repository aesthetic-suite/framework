import { arrayLoop, objectLoop } from '@aesthetic/utils';
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
  protected globalStyleSheet = new GlobalStyleSheet(getSheet('global'));

  protected conditionsStyleSheet = new ConditionsStyleSheet(getSheet('conditions'));

  protected standardStyleSheet = new StandardStyleSheet(getSheet('standard'));

  applyRootVariables(vars: CSSVariables) {
    const root = document.documentElement;

    objectLoop(vars, (value, key) => {
      root.style.setProperty(formatVariableName(key), String(value));
    });
  }

  hydrateStyles() {
    arrayLoop(
      document.querySelectorAll<HTMLStyleElement>('style[data-aesthetic-hydrate]'),
      (style) => {
        const sheet = style.sheet as CSSStyleSheet;
        const type = style.getAttribute('data-aesthetic-type') as SheetType;

        if (type === 'global') {
          hydrateGlobals(this, sheet);
        } else if (type === 'standard') {
          hydrateRules(this, sheet);
        } else if (type === 'conditions') {
          hydrateConditions(this, sheet);
        }

        // Persist the rule index
        if (!this.ruleIndex) {
          this.ruleIndex = Number(style.getAttribute('data-aesthetic-hydrate'));
        }

        // Disable so that we avoid unnecessary hydration
        style.removeAttribute('data-aesthetic-hydrate');
      },
    );
  }
}
