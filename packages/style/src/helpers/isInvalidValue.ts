export default function isInvalidValue(value: unknown): boolean {
  const valueType = typeof value;

  return (
    value === null ||
    value === undefined ||
    (valueType !== 'string' && valueType !== 'number' && valueType !== 'object')
  );
}
