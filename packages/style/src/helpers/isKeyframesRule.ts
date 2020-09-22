export default function isKeyframesRule(value: string): boolean {
  // eslint-disable-next-line no-magic-numbers
  return value.slice(0, 10) === '@keyframes';
}
