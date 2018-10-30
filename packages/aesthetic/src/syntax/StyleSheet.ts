/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Ruleset from './Ruleset';
import { ClassName } from '../types';

export default class StyleSheet<Block> {
  charset: string = 'utf8';

  fontFaces: Ruleset<Block>[] = [];

  imports: string[] = [];

  namespace: string = '';

  protected ruleSets: { [selector: string]: ClassName | Ruleset<Block> } = {};

  addRuleset(selector: string, value: ClassName | Ruleset<Block>): this {
    this.ruleSets[selector] = value;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this);
  }
}
