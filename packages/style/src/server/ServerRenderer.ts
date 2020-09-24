import { Variables } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import TransientStyleRule from './TransientStyleRule';
import formatVariableName from '../helpers/formatVariableName';
import createStyleElement from './createStyleElement';
import ServerSheetManager from './ServerSheetManager';
import { STYLE_RULE } from '../constants';

export default class ServerRenderer extends Renderer {
  sheetManager = new ServerSheetManager({
    conditions: new TransientStyleRule(STYLE_RULE),
    global: new TransientStyleRule(STYLE_RULE),
    standard: new TransientStyleRule(STYLE_RULE),
  });

  applyRootVariables(vars: Variables) {
    const sheet = this.sheetManager.getSheet('global');

    objectLoop(vars, (value, key) => {
      sheet.cssVariables[formatVariableName(key)] = String(value);
    });
  }

  extractStyles<T>(result: T): T {
    global.AESTHETIC_CUSTOM_RENDERER = this;
    process.env.AESTHETIC_SSR = 'true';

    return result;
  }

  renderToStyleMarkup(): string {
    return (
      createStyleElement('global', this.sheetManager.getSheet('global'), this.ruleIndex) +
      createStyleElement('standard', this.sheetManager.getSheet('standard'), this.ruleIndex) +
      createStyleElement('conditions', this.sheetManager.getSheet('conditions'), this.ruleIndex)
    );
  }
}
