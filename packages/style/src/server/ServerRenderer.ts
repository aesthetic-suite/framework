import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import TransientStyleRule from './TransientStyleRule';
import applyUnitToValue from '../helpers/applyUnitToValue';
import formatCssVariableName from '../helpers/formatCssVariableName';
import { STYLE_RULE } from '../constants';
import { CSSVariables } from '../types';

export default class ServerRenderer extends Renderer {
  protected globalStyleSheet = new GlobalStyleSheet(new TransientStyleRule(STYLE_RULE));

  protected conditionsStyleSheet = new ConditionsStyleSheet(new TransientStyleRule(STYLE_RULE));

  protected standardStyleSheet = new StandardStyleSheet(new TransientStyleRule(STYLE_RULE));

  applyRootVariables(vars: CSSVariables) {
    objectLoop(vars, (value, key) => {
      const name = formatCssVariableName(String(key));

      this.globalStyleSheet.sheet.cssVariables[name] = applyUnitToValue(name, value);
    });
  }
}
