import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import TransientStyleRule from './TransientStyleRule';

export default class ServerRenderer extends Renderer {
  protected globalStyleSheet = new GlobalStyleSheet(new TransientStyleRule(CSSRule.STYLE_RULE));

  protected conditionsStyleSheet = new ConditionsStyleSheet(
    new TransientStyleRule(CSSRule.STYLE_RULE),
  );

  protected standardStyleSheet = new StandardStyleSheet(new TransientStyleRule(CSSRule.STYLE_RULE));
}
