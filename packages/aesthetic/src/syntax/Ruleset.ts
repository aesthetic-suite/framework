/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Sheet from './Sheet';

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

  addNested(selector: string, value: Ruleset<Block>): this {
    this.nested[selector] = value;

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

  toObject<T>(): T {
    return {
      // @ts-ignore
      ...this.properties,
      ...this.toObjectRecursive(this.nested),
    };
  }

  private toObjectRecursive(map: { [key: string]: Ruleset<Block> }): Block {
    const object: any = {};

    Object.keys(map).forEach(key => {
      object[key] = map[key].toObject();
    });

    return object;
  }
}
