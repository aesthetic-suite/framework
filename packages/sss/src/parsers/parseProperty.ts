import { Value } from '@aesthetic/types';
import Block from '../Block';
import { AddPropertyCallback, ParserOptions, Properties, PropertyHandler } from '../types';

export default function parseProperty<T extends object>(
  parent: Block<T>,
  name: string,
  value: unknown,
  options: ParserOptions<T>,
  emit: boolean = true,
) {
  const addHandler: AddPropertyCallback = (p, v) => {
    if (v !== undefined) {
      parent.properties[p] = v;

      if (emit) {
        options.onProperty?.(parent, p, v);
      }
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
  } else if (value !== undefined) {
    addHandler(name, value as Value);
  }
}
