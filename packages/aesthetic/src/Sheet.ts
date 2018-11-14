/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import toObjectRecursive from './helpers/toObjectRecursive';
import Ruleset from './Ruleset';
import { ClassName } from './types';

export default class Sheet<Block> {
  atRules: { [rule: string]: any } = {};

  classNames: { [selector: string]: ClassName } = {};

  ruleSets: { [selector: string]: Ruleset<Block> } = {};

  addAtRule(rule: string, value: any): this {
    this.atRules[rule] = value;

    return this;
  }

  addClassName(selector: string, value: ClassName): this {
    this.classNames[selector] = value;

    return this;
  }

  addRuleset(set: Ruleset<Block>): this {
    this.ruleSets[set.selector] = set;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this);
  }

  toObject(): object {
    const atRules: { [key: string]: any } = {};
    const sets: { [key: string]: Sheet<Block> | Ruleset<Block> } = {};

    Object.keys(this.atRules).forEach(key => {
      const value = this.atRules[key];

      if (value instanceof Sheet || value instanceof Ruleset) {
        sets[key] = value;
      } else {
        atRules[key] = value;
      }
    });

    return {
      ...atRules,
      ...this.classNames,
      ...toObjectRecursive(sets),
      ...toObjectRecursive(this.ruleSets),
    };
  }
}
