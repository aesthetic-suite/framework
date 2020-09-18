export function checkList<T extends string | number>(name: string, value: T, items: T[]) {
  if (!items.includes(value)) {
    throw new Error(`Invalid "${name}" value. Must be one of ${items.join(', ')}`);
  }
}
