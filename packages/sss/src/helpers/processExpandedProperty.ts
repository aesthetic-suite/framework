import { Property, Value } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { OnProcessProperty, Processor } from '../types';

export default function processExpandedProperty<T extends object>(
  property: Property,
  object: T,
  processor: Processor<object> | undefined,
  onProcess: OnProcessProperty,
) {
  if (processor) {
    const result = processor(object, onProcess);

    if (result) {
      onProcess(property, result);

      return;
    }
  }

  objectLoop(object, (value, key) => {
    const longName = property + key[0].toUpperCase() + key.slice(1);

    onProcess(longName as Property, (value as unknown) as Value);
  });
}
