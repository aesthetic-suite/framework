/* eslint-disable no-dupe-class-members, lines-between-class-members */

import { objectLoop } from '@aesthetic/utils';
import { Length } from './types';

export default class Block<T extends object = object> {
  readonly nested: { [key: string]: Block<T> } = {};

  readonly properties: { [key: string]: Length } = {};

  readonly selector: string;

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
  addProperty(key: string, value: Length): this;
  addProperty(key: string, value: unknown): this {
    this.properties[key] = value as string;

    return this;
  }

  addProperties(properties: Partial<T> | { [key: string]: Length }): this;
  addProperties(properties: { [key: string]: unknown }): this {
    Object.assign(this.properties, properties);

    return this;
  }

  clone(selector: string): Block<T> {
    return new Block<T>(selector).merge(this);
  }

  merge(block: Block<T>): this {
    this.addProperties(block.properties);

    objectLoop(block.nested, nested => {
      this.addNested(nested);
    });

    return this;
  }

  toObject<O extends object = T>(): O {
    const object: { [key: string]: unknown } = { ...this.properties };

    objectLoop(this.nested, (block, selector) => {
      object[selector] = block.toObject();
    });

    return object as O;
  }
}
