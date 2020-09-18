import { Variables } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import StyleSheet from '../StyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import TransientStyleRule from './TransientStyleRule';
import formatVariableName from '../helpers/formatVariableName';
import createStyleElement from './createStyleElement';
import { STYLE_RULE } from '../constants';

export default class ServerRenderer extends Renderer {
  conditions = new ConditionsStyleSheet('conditions', new TransientStyleRule(STYLE_RULE));

  globals = new StyleSheet('global', new TransientStyleRule(STYLE_RULE));

  standards = new StyleSheet('standard', new TransientStyleRule(STYLE_RULE));

  applyRootVariables(vars: Variables) {
    objectLoop(vars, (value, key) => {
      this.globals.sheet.cssVariables[formatVariableName(key)] = String(value);
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
