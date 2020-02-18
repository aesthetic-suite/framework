import { StyleRule } from './types';

export default abstract class BaseStyleSheet {
  sheet: StyleRule;

  constructor(sheet: StyleRule) {
    this.sheet = sheet;
  }

  toString(): string {
    const { sheet } = this;
    let css = '';

    for (let i = 0; i < sheet.cssRules.length; i += 1) {
      css += sheet.cssRules[i].cssText;
    }

    return css;
  }
}
