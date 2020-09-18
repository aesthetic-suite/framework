import { Variables } from '@aesthetic/types';
import { arrayLoop, objectLoop, isSSR } from '@aesthetic/utils';
import Renderer from '../Renderer';
import StyleSheet from '../StyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import formatVariableName from '../helpers/formatVariableName';
import getDocumentStyleSheet from '../helpers/getDocumentStyleSheet';
import { hydrateGlobals, hydrateRules, hydrateConditions } from './hydrateStyles';
import { SheetType, StyleRule } from '../types';

function getSheet(type: SheetType): StyleRule {
  return (getDocumentStyleSheet(type) as unknown) as StyleRule;
}

export default class ClientRenderer extends Renderer {
  conditionsStyleSheet = new ConditionsStyleSheet('conditions', getSheet('conditions'));

  globalStyleSheet = new StyleSheet('global', getSheet('global'));

  standardStyleSheet = new StyleSheet('standard', getSheet('standard'));

  applyRootVariables(vars: Variables) {
    // istanbul ignore next
    if (isSSR()) {
      return;
    }

    const root = document.documentElement;

    objectLoop(vars, (value, key) => {
      root.style.setProperty(formatVariableName(key), String(value));
    });
  }

  hydrateStyles(): boolean {
    // istanbul ignore next
    if (isSSR()) {
      return false;
    }

    const styles = document.querySelectorAll<HTMLStyleElement>(
      'style[data-aesthetic-hydrate-index]',
    );

    arrayLoop(styles, (style) => {
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
    });

    return styles.length > 0;
  }
}
