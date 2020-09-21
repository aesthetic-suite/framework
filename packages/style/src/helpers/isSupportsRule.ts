export default function isSupportsRule(value: string): boolean {
  // eslint-disable-next-line no-magic-numbers
  return value.slice(0, 9) === '@supports' && (value[9] === ' ' || value[9] === '(');
}
