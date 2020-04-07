import { objectLoop } from '@aesthetic/utils';
import Renderer from '../Renderer';
import GlobalStyleSheet from '../GlobalStyleSheet';
import ConditionsStyleSheet from '../ConditionsStyleSheet';
import StandardStyleSheet from '../StandardStyleSheet';
import TransientStyleRule from './TransientStyleRule';
import formatVariableName from '../helpers/formatVariableName';
import createStyleElement from './createStyleElement';
import { STYLE_RULE } from '../constants';
import { CSSVariables } from '../types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      AESTHETIC_SSR_CLIENT: ServerRenderer;
    }
  }
}

export default class ServerRenderer extends Renderer {
  conditionsStyleSheet = new ConditionsStyleSheet(new TransientStyleRule(STYLE_RULE));

  globalStyleSheet = new GlobalStyleSheet(new TransientStyleRule(STYLE_RULE));

  standardStyleSheet = new StandardStyleSheet(new TransientStyleRule(STYLE_RULE));

  applyRootVariables(vars: CSSVariables) {
    objectLoop(vars, (value, key) => {
      this.globalStyleSheet.sheet.cssVariables[formatVariableName(key)] = String(value);
    });
  }

  captureStyles<T>(result: T): T {
    global.AESTHETIC_SSR_CLIENT = this;

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
