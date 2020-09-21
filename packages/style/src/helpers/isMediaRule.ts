export default function isMediaRule(value: string): boolean {
  // eslint-disable-next-line no-magic-numbers
  return value.slice(0, 6) === '@media' && (value[6] === ' ' || value[6] === '(');
}
