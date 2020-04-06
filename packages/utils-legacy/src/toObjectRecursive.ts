export interface ToObjectable {
  toObject(): object;
}

export default function toObjectRecursive<T extends object>(
  map: { [key: string]: ToObjectable } | Map<string, ToObjectable>,
  cb?: (key: string, value: unknown) => void,
): T {
  const object: { [key: string]: unknown } = {};

  if (map instanceof Map) {
    map.forEach((obj, key) => {
      object[key] = obj.toObject();

      if (cb) {
        cb(key, object[key]);
      }
    });
  } else {
    Object.keys(map).forEach(key => {
      object[key] = map[key].toObject();

      if (cb) {
        cb(key, object[key]);
      }
    });
  }

  return object as T;
}
