import { BackgroundProperty } from '../types';
import { join, divide } from '../transformProperty';

export default function transformBackground(prop: BackgroundProperty): string {
  return join(
    prop.color,
    prop.image,
    divide(prop.position, prop.size),
    prop.repeat,
    prop.attachment,
    prop.clip,
    prop.origin,
  );
}
