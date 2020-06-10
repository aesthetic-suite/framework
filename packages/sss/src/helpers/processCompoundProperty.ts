import { Property, Value } from '@aesthetic/types';
import { OnProcessProperty, Processor } from '../types';

export default function processCompoundProperty<T extends object>(
  property: Property,
  object: T | T[],
  processor: Processor<object>,
  onProcess: OnProcessProperty,
) {
  let value: unknown = '';

  const handler = (item: T) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return item;
    }

    return processor(item, onProcess);
  };

  if (Array.isArray(object)) {
    const result = object.map(handler);

    value = Array.from(new Set(result)).filter(Boolean).join(', ');
  } else {
    value = handler(object);
  }

  if (value) {
    onProcess(property, value as Value);
  }
}
