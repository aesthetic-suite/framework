import Renderer from '../Renderer';
import GlobalStyleSheet from './GlobalStyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';
import { StyleParams } from '../types';

export default class ClientRenderer extends Renderer {
  protected globalStyleSheet = new GlobalStyleSheet();

  protected conditionsStyleSheet = new ConditionsStyleSheet();

  protected standardStyleSheet = new StandardStyleSheet();

  /**
   * Insert a CSS rule into either the standard or conditional style sheet.
   */
  protected insertRule(rule: string, params: StyleParams): number {
    const { conditions = [], type } = params;

    if (type === 'global') {
      return this.globalStyleSheet.insertRule(rule);
    }

    // Insert into the conditional style sheet if conditions exist
    if (type === 'conditions' || conditions.length > 0) {
      return this.conditionsStyleSheet.insertRule(conditions, rule);
    }

    // No media or feature queries so insert into the standard style sheet
    return this.standardStyleSheet.insertRule(rule);
  }
}
