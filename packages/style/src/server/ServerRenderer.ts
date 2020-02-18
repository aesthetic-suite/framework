import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import TransientStyleRule from './TransientStyleRule';
import applyUnitToValue from '../helpers/applyUnitToValue';
import formatCssVariableName from '../helpers/formatCssVariableName';
import { CSSVariables } from '../types';

export default class ServerRenderer extends Renderer {
  protected globalStyleSheet = new GlobalStyleSheet(new TransientStyleRule(CSSRule.STYLE_RULE));

  protected conditionsStyleSheet = new ConditionsStyleSheet(
    new TransientStyleRule(CSSRule.STYLE_RULE),
  );

  protected standardStyleSheet = new StandardStyleSheet(new TransientStyleRule(CSSRule.STYLE_RULE));

  applyRootVariables(vars: CSSVariables) {
    Object.keys(vars).forEach(key => {
      const name = formatCssVariableName(key);

      this.globalStyleSheet.sheet.cssVariables[name] = applyUnitToValue(name, vars[key]);
    });
  }
}
