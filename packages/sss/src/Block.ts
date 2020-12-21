/* eslint-disable no-dupe-class-members, lines-between-class-members */

import { ClassName, Value } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';

export default class Block<T extends object = object> {
  className: string = '';

  readonly nested: Record<string, Block<T>> = {};

  parent?: Block<T>;

  readonly properties: Record<string, Value> = {};

  readonly selector: string;

  readonly variables: Record<string, Value> = {};

  readonly variants: Record<string, Block<T>> = {};

  constructor(selector: string = '') {
    this.selector = selector;
  }

  addClassName(name: ClassName) {
    if (this.parent) {
      this.parent.addClassName(name);
    } else {
      this.className += ` ${name}`;
    }
  }

  addNested(block: Block<T>): Block<T> {
    if (this.nested[block.selector]) {
      this.nested[block.selector].merge(block);
    } else {
      this.nested[block.selector] = block;
    }

    // eslint-disable-next-line no-param-reassign
    block.parent = this;

    return block;
  }

  addProperty<K extends keyof T>(key: K, value: T[K]): this;
  addProperty(key: string, value: Value): this;
  addProperty(key: string, value: unknown): this {
    this.properties[key] = value as string;

    return this;
  }

  addVariable(key: string, value: Value): this {
    this.variables[key] = value;

    return this;
  }

  addVariant(type: string, block: Block<T>): Block<T> {
    this.variants[type] = block;

    return block;
  }

  getSelectors(): string[] {
    const selectors: string[] = [];
    let block: Block<T> | undefined = this;

    while (block) {
      if (block.selector) {
        selectors.unshift(block.selector);
      }

      block = block.parent;
    }

    return selectors;
  }

  merge(block: Block<T>): this {
    Object.assign(this.properties, block.properties);

    objectLoop(block.nested, (nested) => {
      this.addNested(nested);
    });

    return this;
  }

  toObject<O extends object = T>(): O {
    const object: Record<string, unknown> = {
      ...this.variables,
      ...this.properties,
    };

    objectLoop(this.nested, (block, selector) => {
      object[selector] = block.toObject();
    });

    return object as O;
  }
}
