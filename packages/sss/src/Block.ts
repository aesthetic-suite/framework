import { Value } from '@aesthetic/types';
import { joinQueries, objectLoop } from '@aesthetic/utils';

export default class Block<T extends object = object> {
  result?: unknown;

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

  addResult(result: unknown) {
    if (this.parent) {
      this.parent.addResult(result);

      return;
    }

    const type = typeof result;

    if (this.result === undefined) {
      this.result = result;
    } else if (type === 'string') {
      this.result += ` ${result}`;
    } else if (type === 'object' && result) {
      Object.assign(this.result, result);
    }
  }

  nest(child: Block<T>): Block<T> {
    if (this.nested[child.id]) {
      this.nested[child.id].merge(child);
    } else {
      this.nested[child.id] = child;
    }

    child.parent = this;
    child.media = joinQueries(this.media, child.media);
    child.selector = this.selector + child.selector;
    child.supports = joinQueries(this.supports, child.supports);

    return child;
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
