/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Ruleset from './Ruleset';
import { ClassName } from '../types';

export default class Sheet<Block> {
  protected ruleSets: { [selector: string]: ClassName | Ruleset<Block> } = {};

  addRuleset(selector: string, value: ClassName | Ruleset<Block>): this {
    this.ruleSets[selector] = value;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this);
  }
}
