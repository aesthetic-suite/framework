import { Transformer, TransformerHandler, Properties } from './types';

export default function createTransformer<T>(
  property: keyof Properties,
  transformer: Transformer<T>,
): TransformerHandler<T> {
  return (prop, wrap) =>
    transformer(prop, {
      join(...props) {
        return props.filter(Boolean).join(' ');
      },
      separate(...props) {
        return props.filter(Boolean).join(' / ');
      },
      wrap(value) {
        return wrap(property, value);
      },
    });
}
