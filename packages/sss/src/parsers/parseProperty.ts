import { Value } from '@aesthetic/types';
import Block from '../Block';
import { ParserOptions, AddPropertyCallback, PropertyHandler, Properties } from '../types';

export default function parseProperty<T extends object>(
  parent: Block<T>,
  name: string,
  value: unknown,
  options: ParserOptions<T>,
) {
  if (value === undefined) {
    return;
  }

  const addHandler: AddPropertyCallback = (p, v) => {
    if (v !== undefined) {
      parent.addProperty(p, v);
      options.onProperty?.(parent, p, v);
    }
  };

  const { customProperties } = options;

  // Custom property
  if (name in customProperties) {
    (customProperties[name as keyof Properties] as PropertyHandler<Value>)(
      value as Value,
      addHandler,
    );

    // Normal property
  } else if (typeof value === 'number' || typeof value === 'string') {
    addHandler(name, value);
  }
}
