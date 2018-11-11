/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Ruleset from './Ruleset';
import { ClassName } from '../types';

export default class Sheet<Block> {
  atRules: { [rule: string]: any } = {};

  ruleSets: { [selector: string]: ClassName | Ruleset<Block> } = {};

  addAtRule(rule: string, value: any): this {
    this.atRules[rule] = value;

    return this;
  }

  addRuleset(selector: string, value: ClassName | Ruleset<Block>): this {
    this.ruleSets[selector] = value;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this);
  }
}
