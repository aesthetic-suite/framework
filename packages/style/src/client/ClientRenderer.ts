import { Variables } from '@aesthetic/types';
import { arrayLoop, objectLoop, isSSR } from '@aesthetic/utils';
import Renderer from '../Renderer';
import StyleSheet from '../StyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import formatVariableName from '../helpers/formatVariableName';
import { hydrateGlobals, hydrateRules, hydrateConditions } from './hydrateStyles';
import { SheetType } from '../types';

export default class ClientRenderer extends Renderer {
  conditions = new ConditionsStyleSheet('conditions');

  globals = new StyleSheet('global');

  standards = new StyleSheet('standard');

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
          this.globals.lastIndex = lastIndex;
          break;

        case 'conditions':
          hydrateConditions(this, sheet);
          this.conditions.lastIndex = lastIndex;
          break;

        default:
          hydrateRules(this, sheet);
          this.standards.lastIndex = lastIndex;
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
