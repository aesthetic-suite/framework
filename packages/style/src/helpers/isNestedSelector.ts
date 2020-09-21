export default function isNestedSelector(value: string): boolean {
  const char = value[0];

  return (
    char === ':' ||
    char === '[' ||
    char === '>' ||
    char === '~' ||
    char === '+' ||
    char === '*' ||
    char === '|'
  );
}
