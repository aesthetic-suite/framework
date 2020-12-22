import { ClassName, Value } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';

export default class Block<T extends object = object> {
  className: string = '';

  media: string = '';

  readonly nested: Record<string, Block<T>> = {};

  parent?: Block<T>;

  readonly properties: Record<string, Value> = {};

  readonly id: string;

  selector: string = '';

  supports: string = '';

  readonly variables: Record<string, Value> = {};

  readonly variants: Record<string, Block<T>> = {};

  constructor(id: string = '') {
    this.id = id;
  }

  addClassName(name: ClassName) {
    if (this.parent) {
      this.parent.addClassName(name);
    } else {
      this.className += ` ${name}`;
    }
  }

  nest(block: Block<T>): Block<T> {
    if (this.nested[block.id]) {
      this.nested[block.id].merge(block);
    } else {
      this.nested[block.id] = block;
    }

    block.parent = this;

    return block;
  }

  merge(block: Block<T>): this {
    Object.assign(this.properties, block.properties);

    objectLoop(block.nested, (nested) => {
      this.nest(nested);
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
