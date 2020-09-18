const SELECTOR = /^(:|\[|>|~|\+|\*|\|)/u;

export default function isNestedSelector(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return SELECTOR.test(value);
}
