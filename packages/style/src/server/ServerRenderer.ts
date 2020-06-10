import { Variables } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import TransientStyleRule from './TransientStyleRule';
import formatVariableName from '../helpers/formatVariableName';
import createStyleElement from './createStyleElement';
import { STYLE_RULE } from '../constants';

export default class ServerRenderer extends Renderer {
  conditionsStyleSheet = new ConditionsStyleSheet(new TransientStyleRule(STYLE_RULE));

  globalStyleSheet = new GlobalStyleSheet(new TransientStyleRule(STYLE_RULE));

  standardStyleSheet = new StandardStyleSheet(new TransientStyleRule(STYLE_RULE));

  applyRootVariables(vars: Variables) {
    objectLoop(vars, (value, key) => {
      this.globalStyleSheet.sheet.cssVariables[formatVariableName(key)] = String(value);
    });
  }

  extractStyles<T>(result: T): T {
    global.AESTHETIC_CUSTOM_RENDERER = this;

    return result;
  }

  renderToStyleMarkup(): string {
    return (
      createStyleElement('global', this.getRootRule('global'), this.ruleIndex) +
      createStyleElement('standard', this.getRootRule('standard'), this.ruleIndex) +
      createStyleElement('conditions', this.getRootRule('conditions'), this.ruleIndex)
    );
  }
}
