/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

interface ToObjectable {
  toObject(): any;
}

export default function toObjectRecursive<T extends object>(map: {
  [key: string]: ToObjectable;
}): T {
  const object: any = {};

  Object.keys(map).forEach(key => {
    object[key] = map[key].toObject();
  });

  return object;
}
