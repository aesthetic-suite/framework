/* eslint-disable no-dupe-class-members, lines-between-class-members */

import { Value } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';

export default class Block<T extends object = object> {
  readonly nested: Record<string, Block<T>> = {};

  readonly properties: Record<string, Value> = {};

  readonly selector: string;

  readonly variables: Record<string, Value> = {};

  variants?: Block<T>;

  constructor(selector: string) {
    this.selector = selector;
  }

  addNested(block: Block<T>, merge: boolean = true): this {
    if (merge && this.nested[block.selector]) {
      this.nested[block.selector].merge(block);
    } else {
      this.nested[block.selector] = block;
    }

    return this;
  }

  addProperty<K extends keyof T>(key: K, value: T[K]): this;
  addProperty(key: string, value: Value): this;
  addProperty(key: string, value: unknown): this {
    this.properties[key] = value as string;

    return this;
  }

  addProperties(properties: Partial<T> | { [key: string]: Value }): this;
  addProperties(properties: { [key: string]: unknown }): this {
    Object.assign(this.properties, properties);

    return this;
  }

  addVariable(key: string, value: Value): this {
    this.variables[key] = value;

    return this;
  }

  addVariant(block: Block<T>): this {
    if (!this.variants) {
      this.variants = new Block('@variants');
    }

    this.variants.addNested(block);

    return this;
  }

  clone(selector: string): Block<T> {
    return new Block<T>(selector).merge(this);
  }

  merge(block: Block<T>): this {
    this.addProperties(block.properties);

    objectLoop(block.nested, (nested) => {
      this.addNested(nested);
    });

    return this;
  }

  toObject<O extends object = T>(): O {
    const object: Record<string, unknown> = {};

    Object.assign(object, this.variables);
    Object.assign(object, this.properties);

    objectLoop(this.nested, (block, selector) => {
      object[selector] = block.toObject();
    });

    return object as O;
  }
}
