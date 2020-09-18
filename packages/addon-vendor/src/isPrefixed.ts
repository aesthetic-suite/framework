const PATTERN = /^-(ms|moz|webkit)-/u;

export default function isPrefixed(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
