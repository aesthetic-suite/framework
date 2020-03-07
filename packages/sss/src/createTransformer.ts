import { toArray, isObject } from '@aesthetic/utils';
import { Transformer, TransformerHandler, Properties, TransformerUtils } from './types';

export default function createTransformer<T>(
  property: keyof Properties,
  transformer?: Transformer<T>,
): TransformerHandler<T> {
  return (prop, wrap, customTransformer) => {
    const utils: TransformerUtils = {
      join(...props) {
        return props.filter(Boolean).join(' ');
      },
      separate(...props) {
        return props.filter(Boolean).join(' / ');
      },
      wrap(value) {
        return wrap(property, value);
      },
    };

    return toArray(prop)
      .map(item => {
        if (isObject(item)) {
          if (customTransformer) {
            return customTransformer(item, utils);
          }

          if (transformer) {
            return transformer(prop, utils);
          }

          if (__DEV__) {
            throw new Error(`Missing transformer for "${property}".`);
          }
        }

        return item;
      })
      .join(', ');
  };
}
