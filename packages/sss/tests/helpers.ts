import { objectLoop, isObject } from '@aesthetic/utils';
import Block from '../src/Block';
import { Properties } from '../src/types';

export function createBlock(selector: string, properties?: object): Block<Properties> {
  const block = new Block(selector);

  if (properties === undefined) {
    return block;
  }

  objectLoop(properties, (value, key) => {
    if (isObject(value)) {
      block.addNested(createBlock(key, value));
    } else {
      block.addProperty(key, value);
    }
  });

  return block;
}

export function createExpectedBlock(selector: string, properties?: object): Block<Properties> {
  const block = createBlock(selector, properties);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  block.parent = expect.any(Block);

  return block;
}
