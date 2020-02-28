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
