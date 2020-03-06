import { BackgroundProperty } from '../types';
import createTransformer from '../createTransformer';

export default createTransformer<BackgroundProperty>(
  'background',
  (prop, { join, separate, wrap }) =>
    join(
      prop.color,
      prop.image,
      separate(wrap(prop.position), wrap(prop.size)),
      prop.repeat,
      prop.attachment,
      prop.clip,
      prop.origin,
    ),
);
