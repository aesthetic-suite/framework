export default class Block<T extends object> {
  readonly nested: Map<string, Block<T>> = new Map();

  readonly properties: Partial<T> = {};

  readonly selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  addNested(block: Block<T>, merge: boolean = true): this {
    if (merge && this.nested.has(block.selector)) {
      this.nested.get(block.selector)!.merge(block);
    } else {
      this.nested.set(block.selector, block);
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
    const block = new Block(selector);

    return block.merge(this);
  }

  merge(block: Block<T>): this {
    this.addProperties(block.properties);

    block.nested.forEach(nested => {
      this.addNested(nested);
    });

    return this;
  }

  toObject(): object {
    const object: { [key: string]: unknown } = { ...this.properties };

    this.nested.forEach((block, selector) => {
      object[selector] = block.toObject();
    });

    return object;
  }
}
