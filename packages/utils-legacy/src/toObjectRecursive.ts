export interface ToObjectable {
  toObject(): object;
}

export default function toObjectRecursive<T extends object>(
  map: { [key: string]: ToObjectable } | Map<string, ToObjectable>,
): T {
  const object: { [key: string]: unknown } = {};

  if (map instanceof Map) {
    map.forEach((obj, key) => {
      object[key] = obj.toObject();
    });
  } else {
    Object.keys(map).forEach(key => {
      object[key] = map[key].toObject();
    });
  }

  return object as T;
}
