export interface ToObjectable {
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
