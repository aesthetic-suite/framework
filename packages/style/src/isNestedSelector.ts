const PATTERN = /^(:|\[|>|~|\+|\*)/u;

export default function isNestedSelector(value: string): boolean {
  return PATTERN.test(value);
}
