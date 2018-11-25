/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import toObjectRecursive from './helpers/toObjectRecursive';
import Sheet from './Sheet';

export default class Ruleset<Block extends object> {
  nested: { [selector: string]: Ruleset<Block> } = {};

  parent: Ruleset<Block> | null = null;

  properties: Partial<Block> = {};

  root: Sheet<Block>;

  selector: string;

  constructor(selector: string, root: Sheet<Block>, parent: Ruleset<Block> | null = null) {
    this.selector = selector;
    this.root = root;
    this.parent = parent;
  }

  addNested(selector: string, ruleset: Ruleset<Block>, merge: boolean = true): this {
    if (merge && this.nested[selector]) {
      this.nested[selector].merge(ruleset);
    } else {
      this.nested[selector] = ruleset;
    }

    return this;
  }

  addProperty(key: keyof Block, value: any): this {
    this.properties[key] = value;

    return this;
  }

  createRuleset(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this.root, this);
  }

  merge(ruleset: Ruleset<Block>): this {
    Object.assign(this.properties, ruleset.properties);

    Object.keys(ruleset.nested).forEach(selector => {
      this.addNested(selector, ruleset.nested[selector]);
    });

    return this;
  }

  toObject(): Block {
    return Object.assign({}, this.properties, toObjectRecursive(this.nested)) as Block;
  }
}
