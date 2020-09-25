/* eslint-disable sort-keys */

import { Variables } from '@aesthetic/types';
import { arrayLoop, objectLoop, isSSR } from '@aesthetic/utils';
import Renderer from '../Renderer';
import SheetManager from '../SheetManager';
import formatVariableName from '../helpers/formatVariableName';
import { hydrateGlobals, hydrateRules, hydrateConditions } from './hydrateStyles';
import { SheetType, StyleRule } from '../types';
import { getDocumentStyleSheet } from '../helpers';

function getSheet(type: SheetType): StyleRule {
  return (getDocumentStyleSheet(type) as unknown) as StyleRule;
}

export default class ClientRenderer extends Renderer {
  sheetManager = new SheetManager({
    // Order is important here!
    global: getSheet('global'),
    standard: getSheet('standard'),
    conditions: getSheet('conditions'),
  });

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

      if (type === 'global') {
        hydrateGlobals(this, sheet);
      } else if (type === 'conditions') {
        hydrateConditions(this, sheet);
      } else {
        hydrateRules(this, sheet);
      }

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
