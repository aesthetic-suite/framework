export default function isNestedSelector(value: string): boolean {
  const char = value.charAt(0);

  return char === ':' || char === '[' || char === '>' || char === '&';
}
