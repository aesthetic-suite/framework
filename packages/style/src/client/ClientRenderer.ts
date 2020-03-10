import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import formatVariableName from '../helpers/formatVariableName';
import getDocumentStyleSheet from '../helpers/getDocumentStyleSheet';
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
}
