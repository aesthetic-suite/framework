const PATTERN = /^(:|\[|>|~|\+|\*)/u;

export default function isNestedSelector(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
