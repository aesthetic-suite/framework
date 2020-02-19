import { StyleRule } from './types';

export default abstract class BaseStyleSheet {
  sheet: StyleRule;

  constructor(sheet: StyleRule) {
    this.sheet = sheet;
  }
}
