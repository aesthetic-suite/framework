import { ListStyleProperty } from '../types';
import { join } from '../transformProperty';

export default function transformListStyle(prop: ListStyleProperty): string {
  return join(prop.type, prop.position, prop.image);
}
