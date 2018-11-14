/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import deepMerge from 'lodash/merge';
import Sheet from './Sheet';
import toObjectRecursive from './toObjectRecursive';

export default class Ruleset<Block> {
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

  addNested(selector: string, value: Ruleset<Block>, merge: boolean = true): this {
    if (merge && this.nested[selector]) {
      this.nested[selector].merge(value);
    } else {
      this.nested[selector] = value;
    }

    return this;
  }

  addProperty(key: keyof Block, value: any): this {
    this.properties[key] = value;

    return this;
  }

  createChild(selector: string): Ruleset<Block> {
    return new Ruleset(selector, this.root, this);
  }

  getFullSelector(): string {
    return `${this.parent ? this.parent.getFullSelector() : ''}${this.selector}`;
  }

  merge(ruleset: Ruleset<Block>): this {
    Object.assign(this.properties, ruleset.properties);

    Object.keys(ruleset.nested).forEach(selector => {
      const set = ruleset.nested[selector];

      if (this.nested[selector]) {
        this.nested[selector].merge(set);
      } else {
        this.addNested(selector, set);
      }
    });

    return this;
  }

  toObject(): object {
    return {
      // @ts-ignore
      ...this.properties,
      ...toObjectRecursive(this.nested),
    };
  }
}
