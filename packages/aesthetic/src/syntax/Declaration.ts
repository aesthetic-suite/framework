/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Pseudos } from 'csstype';
import StyleSheet from './StyleSheet';

export default class Declaration<P extends object> {
  parent: Declaration<P> | null = null;

  root: StyleSheet<P>;

  selector: string;

  protected mediaQueries: { [mediaQuery: string]: Declaration<P> } = {};

  protected nested: { [selector: string]: Declaration<P> } = {};

  protected pseudos: { [K in Pseudos]?: Declaration<P> } = {};

  protected properties: Partial<P> = {};

  protected supports: { [featureQuery: string]: Declaration<P> } = {};

  constructor(selector: string, root: StyleSheet<P>, parent: Declaration<P> | null = null) {
    this.selector = selector;
    this.root = root;
    this.parent = parent;
  }

  addMediaQuery(mediaQuery: string, value: Declaration<P>): this {
    this.mediaQueries[mediaQuery] = value;

    return this;
  }

  addNested(selector: string, value: Declaration<P>): this {
    this.nested[selector] = value;

    return this;
  }

  addPseudo<K extends Pseudos>(pseudo: K, value: Declaration<P>): this {
    this.pseudos[pseudo] = value;

    return this;
  }

  addProperty<K extends keyof P>(key: K, value: P[K]): this {
    this.properties[key] = value;

    return this;
  }

  addSupports(key: string, value: Declaration<P>): this {
    this.supports[key] = value;

    return this;
  }

  createChild(selector: string): Declaration<P> {
    return new Declaration(selector, this.root, this);
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

  private toObjectRecursive(map: { [key: string]: Declaration<P> }): P {
    const object: any = {};

    Object.keys(map).forEach(key => {
      object[key] = map[key].toObject();
    });

    return object;
  }
}
