/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Pseudos } from 'csstype';
import StyleSheet from './StyleSheet';

export default class Ruleset<Block> {
  parent: Ruleset<Block> | null = null;

  root: StyleSheet<Block>;

  selector: string;

  protected mediaQueries: { [mediaQuery: string]: Ruleset<Block> } = {};

  protected nested: { [selector: string]: Ruleset<Block> } = {};

  protected pseudos: { [K in Pseudos]?: Ruleset<Block> } = {};

  protected properties: Partial<Block> = {};

  protected supports: { [featureQuery: string]: Ruleset<Block> } = {};

  constructor(selector: string, root: StyleSheet<Block>, parent: Ruleset<Block> | null = null) {
    this.selector = selector;
    this.root = root;
    this.parent = parent;
  }

  addMediaQuery(mediaQuery: string, value: Ruleset<Block>): this {
    this.mediaQueries[mediaQuery] = value;

    return this;
  }

  addNested(selector: string, value: Ruleset<Block>): this {
    this.nested[selector] = value;

    return this;
  }

  addPseudo<K extends Pseudos>(pseudo: K, value: Ruleset<Block>): this {
    this.pseudos[pseudo] = value;

    return this;
  }

  addProperty<K extends keyof Block>(key: K, value: Block[K]): this {
    this.properties[key] = value;

    return this;
  }

  addSupports(key: string, value: Ruleset<Block>): this {
    this.supports[key] = value;

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
      ...this.toObjectRecursive(this.pseudos),
      ...this.toObjectRecursive(this.nested),
      ...this.toObjectRecursive(this.mediaQueries),
      ...this.toObjectRecursive(this.supports),
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
