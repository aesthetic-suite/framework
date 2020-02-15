const PATTERN = /^@supports(\s+|\()/u;

export default function isSupportsCondition(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return PATTERN.test(value);
}
