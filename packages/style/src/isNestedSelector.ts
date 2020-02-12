export default function isNestedSelector(value: string): boolean {
  const char = value.charAt(0);

  // https://jsperf.com/string-startswith/66
  return char === ':' || char === '[' || char === '>' || char === '&';
}
