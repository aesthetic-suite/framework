import { objectLoop } from '@aesthetic/utils';

export default class Block<T extends object> {
  readonly nested: { [key: string]: Block<T> } = {};

  readonly properties: Partial<T> = {};

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

  addProperty<K extends keyof T>(key: K, value: T[K]): this {
    this.properties[key] = value;

    return this;
  }

  addProperties(properties: Partial<T>): this {
    Object.assign(this.properties, properties);

    return this;
  }

  clone(selector: string): Block<T> {
    return new Block(selector).merge(this);
  }

  merge(block: Block<T>): this {
    this.addProperties(block.properties);

    objectLoop(block.nested, nested => {
      this.addNested(nested);
    });

    return this;
  }

  toObject(): object {
    const object: { [key: string]: unknown } = { ...this.properties };

    objectLoop(this.nested, (block, selector) => {
      object[selector] = block.toObject();
    });

    return object;
  }
}
