export default function isObject(value: any): value is object {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}
