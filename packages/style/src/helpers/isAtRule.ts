const AT_RULE = /^@\w+/u;

export default function isAtRule(value: string): boolean {
  // https://jsperf.com/string-startswith/66
  return AT_RULE.test(value);
}
