const PATTERN = /^@\w+/u;

export default function isAtRule(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
